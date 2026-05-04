const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getOrders = async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 10, storeId } = req.query;
    
    const filter = {};
    if (storeId && storeId !== 'ALL') filter.website_id = storeId;
    if (status) {
      if (status === 'IN_TRANSIT') {
        filter.status = { in: ['PREP_SHIPPING', 'PICKING', 'SHIPPING'] };
      } else {
        filter.status = status;
      }
    }
    if (search) {
      filter.OR = [
        { customer: { contains: search } },
        { order_number: { contains: search } }
      ];
    }
    if (startDate || endDate) {
      filter.created_at = {};
      if (startDate) filter.created_at.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.created_at.lte = end;
      }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [orders, totalCount] = await Promise.all([
      prisma.orders.findMany({
        where: filter,
        orderBy: { created_at: 'desc' },
        include: { order_items: true },
        skip,
        take
      }),
      prisma.orders.count({ where: filter })
    ]);

    res.json({
      data: orders,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
      include: { order_items: true, OrderStatusHistory: { orderBy: { createdAt: 'desc' } } }
    });
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customer, customerEmail, customerPhone, shippingAddress, paymentMethod, notes, items, storeId = 'KR' } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: '장바구니가 비어 있습니다.' });
    }

    const productIds = items.map(i => BigInt(i.productId));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let total_amount = 0;
    const orderItemsToCreate = [];

    for (const item of items) {
      const product = dbProducts.find(p => p.id === BigInt(item.productId));
      if (!product) return res.status(400).json({ error: `상품을 찾을 수 없습니다: ID ${item.productId}` });
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `재고 부족: ${product.name} (남은 수량: ${product.stock_quantity})` });
      }
      
      total_amount += Number(product.price) * item.quantity;
      orderItemsToCreate.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity
      });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const order_number = `ORD-${dateStr}-${randomChars}`;

    const newOrder = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: BigInt(item.productId) },
          data: { stock_quantity: { decrement: item.quantity } }
        });
      }

      return await tx.orders.create({
        data: {
          website_id: storeId,
          order_number,
          customer,
          customerEmail,
          customerPhone,
          paymentMethod: paymentMethod || 'CREDIT_CARD',
          total_amount,
          status: 'PAID', // 결제 완료 상태로 생성
          notes,
          order_items: {
            create: orderItemsToCreate
          },
          OrderStatusHistory: {
            create: { newStatus: 'PAID' }
          }
        },
        include: { order_items: true }
      });
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await prisma.orders.findUnique({ 
      where: { id: parseInt(id) },
      include: { order_items: true } // get items to restore stock
    });
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (status === 'CANCELLED' && !['PAID', 'PREP_SHIPPING'].includes(order.status)) {
      return res.status(400).json({ error: '취소는 결제완료(PAID) 및 배송준비중(PREP_SHIPPING) 단계에서만 가능합니다.' });
    }
    if (status === 'RETURNED' && order.status !== 'DELIVERED') {
      return res.status(400).json({ error: '반품은 배송완료(DELIVERED) 상태에서만 가능합니다.' });
    }
    
    let updatedOrder;

    // 만약 취소(CANCELLED) 또는 반품(RETURNED)으로 상태가 변경되는 경우 재고 복구
    if ((status === 'CANCELLED' || status === 'RETURNED') && 
        (order.status !== 'CANCELLED' && order.status !== 'RETURNED')) {
      updatedOrder = await prisma.$transaction(async (tx) => {
        // 재고 원복
        for (const item of order.order_items) {
          if (item.product_id) {
            await tx.product.update({
              where: { id: BigInt(item.product_id) },
              data: { stock_quantity: { increment: item.quantity } }
            });
          }
        }
        // 상태 업데이트 및 이력 기록
        return await tx.orders.update({
          where: { id: parseInt(id) },
          data: { 
            status,
            OrderStatusHistory: {
              create: { oldStatus: order.status, newStatus: status }
            }
          }
        });
      });
    } else {
      updatedOrder = await prisma.orders.update({
        where: { id: parseInt(id) },
        data: { 
          status,
          OrderStatusHistory: {
            create: { oldStatus: order.status, newStatus: status }
          }
        }
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { status } = req.body;
    
    const updatedItem = await prisma.order_items.update({
      where: { id: parseInt(itemId) },
      data: { status }
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order item status' });
  }
};

exports.seedDummyOrders = async (req, res) => {
  try {
    const dummyNames = ['김철수', '이영희', '홍길동', '박지민', '최동훈', '정유진', '강다니엘'];
    const addresses = [
      '서울시 강남구 테헤란로 123',
      '부산시 해운대구 마린시티 456',
      '경기도 성남시 분당구 판교역로 789',
      '인천시 연수구 송도과학로 101',
      '제주특별자치도 제주시 첨단로 242'
    ];
    const methods = ['CREDIT_CARD', 'KAKAOPAY', 'NAVERPAY', 'BANK_TRANSFER'];
    
    // Fetch real products from database
    let products = await prisma.product.findMany();
    
    // If no products exist, create some first so orders can link to them
    if (products.length === 0) {
      const dummyProducts = [
        { name: "프리미엄 런닝화", price: 120000, stock: 50 },
        { name: "베이직 무지 티셔츠", price: 15000, stock: 200 },
        { name: "스마트 노이즈캔슬링 이어폰", price: 250000, stock: 5 },
        { name: "고급 가죽 지갑", price: 85000, stock: 15 },
        { name: "초경량 등산 배낭", price: 150000, stock: 8 }
      ];
      await prisma.product.createMany({ data: dummyProducts });
      products = await prisma.product.findMany();
    }
    
    for (let i = 0; i < 5; i++) {
      const name = dummyNames[Math.floor(Math.random() * dummyNames.length)];
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `ORD-${dateStr}-${randomChars}`;
      
      const p1 = products[Math.floor(Math.random() * products.length)];
      const qty1 = Math.floor(Math.random() * 2) + 1;
      
      const items = [
        {
          product_id: p1.id,
          product_name: p1.name,
          unit_price: p1.price,
          quantity: qty1
        }
      ];
      
      // 50% chance to have a second item
      if (Math.random() > 0.5) {
        const p2 = products[Math.floor(Math.random() * products.length)];
        // avoid duplicate same product if possible, but fine for dummy
        items.push({
          product_id: p2.id,
          product_name: p2.name,
          unit_price: p2.price,
          quantity: 1
        });
      }
      
      const total_amount = items.reduce((sum, item) => sum + (Number(item.unit_price) * item.quantity), 0);
      
      await prisma.orders.create({
        data: {
          order_number: orderNumber,
          customer: name,
          customerEmail: `customer_${Math.floor(Math.random() * 1000)}@example.com`,
          customerPhone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          paymentMethod: methods[Math.floor(Math.random() * methods.length)],
          total_amount,
          website_id: 'KR',
          status: 'PAID',
          order_items: {
            create: items
          },
          OrderStatusHistory: {
            create: { newStatus: 'PAID' }
          }
        }
      });
    }

    res.json({ success: true, message: '5 detailed dummy orders created!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed dummy orders' });
  }
};
