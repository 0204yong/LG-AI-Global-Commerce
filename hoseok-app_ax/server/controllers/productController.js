const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
BigInt.prototype.toJSON = function() { return this.toString() };

// GET: 상품 목록 조회
exports.getProducts = async (req, res) => {
  try {
    const { storeId } = req.query;
    const filter = {};
    if (storeId && storeId !== 'ALL') {
      filter.website_id = storeId;
    }
    
    const products = await prisma.product.findMany({
      where: filter,
      include: { ProductTranslation: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// POST: 새 상품 등록
exports.createProduct = async (req, res) => {
  try {
    const { name, productCode, price, description, stock, storeId = 'KR', translations = [] } = req.body;
    const newProduct = await prisma.product.create({
      data: { 
        name, 
        sku: productCode ? String(productCode) : null,
        price: Number(price), 
        description, 
        stock_quantity: Number(stock),
        website_id: storeId,
        ProductTranslation: {
          create: translations
        }
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};
