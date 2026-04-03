// ==================== DATA ====================
let currentStoreId = 'KR';
let activeFilter = 'all';
let cart = [];
let currentModalProduct = null;

let products = [
    { id:'oled_m', cat:'TV', name:'LG SIGNATURE OLED M4', model:'OLED97M4', price:25000000, img:'tv1.png',
      desc:'세계 최초 무선 올레드 TV. 97인치의 경이로움을 별도의 연결 없이 즐기세요.' },
    { id:'oled_evo', cat:'TV', name:'LG OLED evo G4', model:'OLED65G4', price:4200000, img:'tv2.png',
      desc:'밝기 업그레이드의 정점. MLA 기술로 한층 밝고 선명한 화질을 경험하세요.' },
    { id:'soundbar', cat:'AV', name:'LG Soundbar S95TR', model:'S95TR', price:1700000, img:'soundbar.png',
      desc:'돌비 애트모스 9.1.5ch 프리미엄 사운드바. 극장 그 이상의 몰입감.' },
    { id:'fridge', cat:'Appliance', name:'LG 디오스 오브제컬렉션', model:'M874AAA452S', price:3200000, img:'fridge.png',
      desc:'공간에 맞춰 선택하는 컬러와 소재. 나만의 주방을 완성하세요.' },
    { id:'washer', cat:'Appliance', name:'LG 트롬 세탁건조기', model:'FX25ESER', price:2800000, img:'washer.png',
      desc:'세탁부터 건조까지 한 번에. AI가 최적의 코스를 자동 설정합니다.' },
    { id:'gram', cat:'Computing', name:'LG gram Pro 16', model:'16Z90SP', price:2390000, img:'laptop.png',
      desc:'1,199g 초경량 16인치. Intel Core Ultra 프로세서로 AI 성능까지.' }
];

const locales = {
    KR: { flag:'🇰🇷', region:'🇰🇷 대한민국', cur:'₩', rate:1,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'모든 순간을 완벽하게.', heroDesc:'세계 최초 무선 올레드, 압도적 화질을 경험하세요.',
        cta:'지금 구매하기', heading:'인기 제품', buy:'장바구니 담기', cartTitle:'장바구니', total:'합계',
        checkout:'결제하기', placeOrder:'주문하기', orderDone:'주문 완료!', orderDesc:'주문이 성공적으로 접수되었습니다.',
        shipping:'배송 정보', payment:'결제 수단', country:'대한민국',
        p1:'무료 배송', p2:'무이자 할부', p3:'30일 반품 보장' },
    ES: { flag:'🇪🇸', region:'🇪🇸 España', cur:'€', rate:0.00069,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfecto en cada momento.', heroDesc:'El primer OLED inalámbrico del mundo. Vive una calidad de imagen abrumadora.',
        cta:'Comprar Ahora', heading:'Productos Destacados', buy:'Añadir al Carrito', cartTitle:'Carrito', total:'Total',
        checkout:'Pagar', placeOrder:'Realizar Pedido', orderDone:'¡Pedido Confirmado!', orderDesc:'Su pedido ha sido realizado con éxito.',
        shipping:'Datos de Envío', payment:'Método de Pago', country:'España',
        p1:'Envío Gratis', p2:'Financiación sin intereses', p3:'30 días de devolución' },
    UK: { flag:'🇬🇧', region:'🇬🇧 United Kingdom', cur:'£', rate:0.00057,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Innovation for a Better Life.', heroDesc:'Discover the world\'s first wireless OLED.',
        cta:'Shop Now', heading:'Trending Products', buy:'Add to Basket', cartTitle:'Shopping Cart', total:'Total',
        checkout:'Checkout', placeOrder:'Place Order', orderDone:'Order Confirmed!', orderDesc:'Your order has been placed successfully.',
        shipping:'Shipping Details', payment:'Payment', country:'United Kingdom',
        p1:'Free Delivery', p2:'Interest-Free Credit', p3:'30-Day Returns' },
    JP: { flag:'🇯🇵', region:'🇯🇵 日本', cur:'¥', rate:0.11,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'すべての瞬間を完璧に。', heroDesc:'世界初のワイヤレス有機ELテレビ。圧倒的な画質を体験。',
        cta:'今すぐ購入', heading:'人気製品', buy:'カートに入れる', cartTitle:'カート', total:'合計',
        checkout:'お支払い', placeOrder:'注文する', orderDone:'注文確定！', orderDesc:'ご注文を承りました。',
        shipping:'配送情報', payment:'お支払い方法', country:'日本',
        p1:'送料無料', p2:'分割払い対応', p3:'30日間返品可能' },
    DE: { flag:'🇩🇪', region:'🇩🇪 Deutschland', cur:'€', rate:0.00069,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfektion in jedem Moment.', heroDesc:'Der weltweit erste kabellose OLED-TV. Erleben Sie überragende Bildqualität.',
        cta:'Jetzt Kaufen', heading:'Beliebte Produkte', buy:'In den Warenkorb', cartTitle:'Warenkorb', total:'Gesamt',
        checkout:'Zur Kasse', placeOrder:'Bestellen', orderDone:'Bestellung Bestätigt!', orderDesc:'Ihre Bestellung wurde erfolgreich aufgegeben.',
        shipping:'Lieferadresse', payment:'Zahlungsmethode', country:'Deutschland',
        p1:'Kostenloser Versand', p2:'Ratenzahlung', p3:'30 Tage Rückgabe' },
    FR: { flag:'🇫🇷', region:'🇫🇷 France', cur:'€', rate:0.00069,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'La perfection à chaque instant.', heroDesc:'Le premier téléviseur OLED sans fil au monde.',
        cta:'Acheter', heading:'Produits Populaires', buy:'Ajouter au Panier', cartTitle:'Panier', total:'Total',
        checkout:'Paiement', placeOrder:'Commander', orderDone:'Commande Confirmée!', orderDesc:'Votre commande a été passée.',
        shipping:'Adresse de Livraison', payment:'Mode de Paiement', country:'France',
        p1:'Livraison Gratuite', p2:'Paiement en 3x', p3:'Retour sous 30 jours' },
    BR: { flag:'🇧🇷', region:'🇧🇷 Brasil', cur:'R$', rate:0.0037,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfeição em cada momento.', heroDesc:'A primeira TV OLED sem fio do mundo.',
        cta:'Comprar Agora', heading:'Produtos em Destaque', buy:'Adicionar ao Carrinho', cartTitle:'Carrinho', total:'Total',
        checkout:'Pagamento', placeOrder:'Finalizar Pedido', orderDone:'Pedido Confirmado!', orderDesc:'Seu pedido foi realizado com sucesso.',
        shipping:'Endereço de Entrega', payment:'Forma de Pagamento', country:'Brasil',
        p1:'Frete Grátis', p2:'Parcelamento sem juros', p3:'30 dias para devolução' },
    VN: { flag:'🇻🇳', region:'🇻🇳 Việt Nam', cur:'₫', rate:18.5,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Hoàn hảo trong mọi khoảnh khắc.', heroDesc:'TV OLED không dây đầu tiên trên thế giới.',
        cta:'Mua Ngay', heading:'Sản Phẩm Nổi Bật', buy:'Thêm vào giỏ', cartTitle:'Giỏ hàng', total:'Tổng',
        checkout:'Thanh toán', placeOrder:'Đặt hàng', orderDone:'Đặt hàng thành công!', orderDesc:'Đơn hàng của bạn đã được xác nhận.',
        shipping:'Địa chỉ giao hàng', payment:'Phương thức thanh toán', country:'Việt Nam',
        p1:'Miễn phí vận chuyển', p2:'Trả góp 0%', p3:'Đổi trả 30 ngày' }
};

const countryKeywords = {
    '스페인':'ES', '영국':'UK', '미국':'UK', '일본':'JP', '독일':'DE', '프랑스':'FR', '브라질':'BR', '베트남':'VN', '한국':'KR',
    'spain':'ES', 'uk':'UK', 'japan':'JP', 'germany':'DE', 'france':'FR', 'brazil':'BR', 'vietnam':'VN'
};

// ==================== DOM ====================
const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const productGrid = document.getElementById('productGrid');
const modalOverlay = document.getElementById('modalOverlay');
const cartOverlay = document.getElementById('cartOverlay');
const checkoutOverlay = document.getElementById('checkoutOverlay');

// ==================== RENDER STORE ====================
function renderStore(){
    const L = locales[currentStoreId] || locales.KR;
    document.getElementById('regionPill').textContent = L.region;
    document.getElementById('heroLabel').textContent = L.heroLabel;
    document.getElementById('heroTitle').textContent = L.heroTitle;
    document.getElementById('heroDesc').textContent = L.heroDesc;
    document.getElementById('heroCta').textContent = L.cta;
    document.getElementById('sectionHeading').textContent = L.heading;
    document.getElementById('promo1').textContent = L.p1;
    document.getElementById('promo2').textContent = L.p2;
    document.getElementById('promo3').textContent = L.p3;
    const filtered = activeFilter==='all' ? products : products.filter(p=>p.cat===activeFilter);
    productGrid.innerHTML='';
    filtered.forEach(p=>{
        const fp = fmt(p.price, L);
        let badge='', orig='', displayPrice=fp;
        if(p.discount){
            displayPrice = fmt(p.price*(1-p.discount/100), L);
            orig=`<span class="pc-orig">${fp}</span>`;
            badge=`<div class="pc-badge">-${p.discount}%</div>`;
        }
        // Bundle card with multi-image
        if(p.bundleItems && p.bundleItems.length > 0){
            const savings = fmt(p.price - getPrice(p), L);
            let imgGrid = p.bundleItems.map((bi,idx)=>
                `<div class="bundle-thumb"><img src="${bi.img}" alt="${bi.name}"><span class="bundle-thumb-name">${bi.name.split(' ').slice(-1)[0]}</span></div>` +
                (idx < p.bundleItems.length-1 ? '<span class="bundle-plus">+</span>' : '')
            ).join('');
            productGrid.innerHTML+=`
            <div class="product-card bundle-card" onclick="openModal('${p.id}')">
                ${badge}
                <div class="bundle-img-grid">${imgGrid}</div>
                <div class="pc-body">
                    <div class="pc-cat"><i class="fa-solid fa-boxes-stacked"></i> BUNDLE DEAL</div>
                    <div class="pc-name">${p.name}</div>
                    <div class="bundle-composition">${p.bundleItems.map(bi=>bi.name).join(' + ')}</div>
                    <div class="pc-prices"><span class="pc-price">${displayPrice}</span>${orig}</div>
                    <div class="bundle-savings"><i class="fa-solid fa-tag"></i> ${savings} 절약!</div>
                    <button class="pc-buy" onclick="event.stopPropagation();addToCart('${p.id}')">${L.buy}</button>
                </div>
            </div>`;
        } else {
            productGrid.innerHTML+=`
            <div class="product-card" onclick="openModal('${p.id}')">
                <div class="pc-img">${badge}<img src="${p.img}" alt="${p.name}"></div>
                <div class="pc-body">
                    <div class="pc-cat">${p.cat}</div>
                    <div class="pc-name">${p.name}</div>
                    <div class="pc-prices"><span class="pc-price">${displayPrice}</span>${orig}</div>
                    <button class="pc-buy" onclick="event.stopPropagation();addToCart('${p.id}')">${L.buy}</button>
                </div>
            </div>`;
        }
    });
}
function fmt(val,L){ return L.cur + Math.floor(val*L.rate).toLocaleString(); }
function getPrice(p){ return p.discount ? p.price*(1-p.discount/100) : p.price; }

// ==================== MODAL ====================
window.openModal = function(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    currentModalProduct = p;
    const L = locales[currentStoreId]||locales.KR;
    const imgWrap = document.querySelector('.modal-img-wrap');
    // Bundle: show all component images
    if(p.bundleItems && p.bundleItems.length > 0){
        imgWrap.innerHTML = p.bundleItems.map(bi=>
            `<div class="modal-bundle-item"><img src="${bi.img}" alt="${bi.name}"><span>${bi.name}</span></div>`
        ).join('<span class="modal-bundle-plus">+</span>');
    } else {
        imgWrap.innerHTML = `<img id="modalImg" src="${p.img}" alt="${p.name}">`;
    }
    document.getElementById('modalCat').textContent = p.bundleItems ? '📦 BUNDLE DEAL' : p.cat;
    document.getElementById('modalName').textContent = p.name;
    document.getElementById('modalModel').textContent = p.model;
    document.getElementById('modalBuyText').textContent = L.buy;
    document.getElementById('modalShipping').textContent = L.p1;
    // Bundle desc with savings
    if(p.bundleItems){
        const savings = fmt(p.price - getPrice(p), L);
        document.getElementById('modalDesc').innerHTML = `<b>구성:</b> ${p.bundleItems.map(bi=>bi.name).join(' + ')}<br><br><span style="color:#a50034;font-weight:700"><i class="fa-solid fa-tag"></i> ${savings} 절약!</span>`;
    } else {
        document.getElementById('modalDesc').textContent = p.desc;
    }
    if(p.discount){
        document.getElementById('modalPrice').textContent = fmt(getPrice(p),L);
        document.getElementById('modalOrig').textContent = fmt(p.price,L);
        document.getElementById('modalBadgeArea').innerHTML = `<span class="coupon-tag">-${p.discount}% ${p.bundleItems?'BUNDLE':'SALE'}</span>`;
    } else {
        document.getElementById('modalPrice').textContent = fmt(p.price,L);
        document.getElementById('modalOrig').textContent = '';
        document.getElementById('modalBadgeArea').innerHTML = '';
    }
    modalOverlay.classList.add('open');
};
window.closeModal = function(){ modalOverlay.classList.remove('open'); currentModalProduct=null; };
modalOverlay.addEventListener('click',e=>{ if(e.target===modalOverlay) closeModal(); });
window.addToCartFromModal = function(){ if(currentModalProduct) addToCart(currentModalProduct.id); closeModal(); };

// ==================== CART ====================
function addToCart(id){
    const existing = cart.find(c=>c.id===id);
    if(existing){ existing.qty++; } else { cart.push({id, qty:1}); }
    updateCartBadge();
    showToast('✓ 장바구니에 추가되었습니다');
}
function updateCartBadge(){
    const b = document.getElementById('cartBadge');
    const total = cart.reduce((s,c)=>s+c.qty, 0);
    b.textContent = total;
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function showToast(msg){
    const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
    document.body.appendChild(t); setTimeout(()=>t.remove(), 2000);
}
window.openCart = function(){
    renderCartDrawer();
    cartOverlay.classList.add('open');
};
window.closeCart = function(){ cartOverlay.classList.remove('open'); };

function renderCartDrawer(){
    const L = locales[currentStoreId]||locales.KR;
    const ci = document.getElementById('cartItems');
    const cf = document.getElementById('cartFooter');
    document.getElementById('cartTitle').textContent = L.cartTitle;
    if(cart.length===0){
        ci.innerHTML='<div class="cart-empty">장바구니가 비어있습니다.</div>';
        cf.style.display='none'; return;
    }
    cf.style.display='block';
    let html='', grandTotal=0;
    cart.forEach((c,i)=>{
        const p = products.find(x=>x.id===c.id); if(!p) return;
        const price = getPrice(p);
        const lineTotal = price * c.qty;
        grandTotal += lineTotal;
        html+=`<div class="cart-item">
            <div class="cart-item-img"><img src="${p.img}" alt="${p.name}"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${p.name}</div>
                <div class="cart-item-price">${fmt(price,L)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
                    <span>${c.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${i})"><i class="fa-solid fa-trash-can"></i></button>
        </div>`;
    });
    ci.innerHTML = html;
    document.getElementById('cartTotalLabel').textContent = L.total;
    document.getElementById('cartTotalPrice').textContent = fmt(grandTotal, L);
    document.getElementById('checkoutBtnText').textContent = L.checkout;
}
window.changeQty = function(i, d){ cart[i].qty += d; if(cart[i].qty<1) cart.splice(i,1); updateCartBadge(); renderCartDrawer(); };
window.removeFromCart = function(i){ cart.splice(i,1); updateCartBadge(); renderCartDrawer(); };

// ==================== CHECKOUT ====================
window.goToCheckout = function(){
    closeCart();
    const L = locales[currentStoreId]||locales.KR;
    document.getElementById('checkoutTitle').textContent = L.checkout;
    document.getElementById('shippingTitle').textContent = L.shipping;
    document.getElementById('paymentTitle').textContent = L.payment;
    document.getElementById('placeOrderText').textContent = L.placeOrder;
    document.getElementById('checkoutCountry').value = L.country;
    let html='', total=0;
    cart.forEach(c=>{
        const p=products.find(x=>x.id===c.id); if(!p) return;
        const price=getPrice(p); total+=price*c.qty;
        html+=`<div class="cs-row"><span>${p.name} x${c.qty}</span><span>${fmt(price*c.qty,L)}</span></div>`;
    });
    html+=`<div class="cs-total"><span>${L.total}</span><span>${fmt(total,L)}</span></div>`;
    document.getElementById('checkoutSummary').innerHTML = html;
    document.getElementById('checkoutBody').style.display='block';
    document.getElementById('orderComplete').style.display='none';
    checkoutOverlay.classList.add('open');
};
window.closeCheckout = function(){ checkoutOverlay.classList.remove('open'); };
checkoutOverlay.addEventListener('click',e=>{ if(e.target===checkoutOverlay) closeCheckout(); });

window.placeOrder = function(e){
    e.preventDefault();
    const L = locales[currentStoreId]||locales.KR;
    document.getElementById('checkoutBody').style.display='none';
    document.getElementById('orderComplete').style.display='block';
    document.getElementById('orderCompleteTitle').textContent = L.orderDone;
    document.getElementById('orderCompleteDesc').textContent = L.orderDesc;
    document.getElementById('orderNum').textContent = Math.floor(100000+Math.random()*900000);
};
window.resetCart = function(){ cart=[]; updateCartBadge(); };

// ==================== CATEGORY NAV ====================
document.querySelectorAll('.gnb-link').forEach(link=>{
    link.addEventListener('click',e=>{
        e.preventDefault();
        document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
        activeFilter = link.dataset.cat;
        renderStore();
    });
});

// ==================== MOBILE TOGGLE ====================
window.togglePane = function(){
    const ap = document.getElementById('adminPane');
    const label = document.getElementById('toggleLabel');
    ap.classList.toggle('show');
    if(ap.classList.contains('show')){ label.textContent='Store'; } else { label.textContent='AI Admin'; }
};

// ==================== ADMIN CHAT ====================
function addMsg(text,isUser=false){
    const d=document.createElement('div');
    d.className=`message ${isUser?'user-message':'ai-message'}`;
    d.innerHTML=`<div class="avatar"><i class="fa-solid ${isUser?'fa-user':'fa-sparkles'}"></i></div><div class="bubble">${text}</div>`;
    chatContainer.appendChild(d); chatContainer.scrollTop=chatContainer.scrollHeight;
}
window.fillChat = function(txt){ chatInput.value=txt; chatInput.focus(); };

function processIntent(text){
    // ---- Intent 0: Theme Change ----
    if(text.includes('테마') || text.includes('다크') || text.includes('블랙 프라이데이') || text.includes('블랙프라이데이') || text.includes('템플릿')){
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: change_theme()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-palette"></i> change_theme</div>
        <div class="ai-card-details">• theme_id: black_friday<br>• color_mode: dark<br>• accent_color: neon_red<br>• impact: 글로벌 UI 테마 롤아웃 대기중</div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execTheme('black_friday',this)">✓ 승인 (Deploy)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }
    // ---- Intent 0.5: Add Product ----
    if(text.includes('신제품') || text.includes('신규 등록') || text.includes('청소기')){
        const L=locales[currentStoreId]||locales.KR;
        const newPrice = 1250000;
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: add_product()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-plus-circle"></i> add_product</div>
        <div class="ai-card-details">• category: Appliance<br>• product_name: LG 코드제로 오브제컬렉션 A9S<br>• price: <b>${fmt(newPrice,L)}</b><br>• status: 즉시 퍼블리싱 대기중</div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execAddProduct('vacuum', ${newPrice}, this)">✓ 승인 (Publish)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }

    // ---- Intent 1: Coupon / Discount ----
    if(text.includes('할인') || text.includes('쿠폰')){
        const m=text.match(/(\d+)%/); const disc=m?parseInt(m[1]):20;
        let region=currentStoreId, regionName='대한민국';
        if(text.includes('스페인')){region='ES';regionName='España';}
        if(text.includes('미국')||text.includes('영국')){region='UK';regionName='United Kingdom';}
        const tvOnly = text.includes('OLED') || text.includes('TV');
        const appOnly = text.includes('가전') || text.includes('세탁') || text.includes('냉장');
        let catFilter='all', target='전체 상품';
        if(tvOnly){catFilter='TV';target='TV 카테고리';}
        if(appOnly){catFilter='Appliance';target='가전 카테고리';}
        const L=locales[region]||locales.KR;
        // Profitability analysis
        const affectedProducts = catFilter==='all' ? products : products.filter(p=>p.cat===catFilter);
        const totalRevBefore = affectedProducts.reduce((s,p)=>s+p.price,0);
        const totalRevAfter = totalRevBefore * (1 - disc/100);
        const revLoss = totalRevBefore - totalRevAfter;
        const convLift = Math.round(disc * 0.9);
        const netImpact = (convLift * 0.5) - disc;
        const riskLevel = disc <= 15 ? '🟢 Low' : disc <= 30 ? '🟡 Medium' : '🔴 High';
        const profitBar = `<div style="margin-top:.5rem;border-top:1px solid rgba(255,255,255,.1);padding-top:.5rem">
            <div style="font-weight:700;margin-bottom:.3rem">📊 수익성 분석 (AI Forecast)</div>
            <div style="display:flex;justify-content:space-between;font-size:.7rem;margin:.15rem 0"><span>매출 감소</span><span style="color:#ef4444">-${fmt(revLoss,L)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:.7rem;margin:.15rem 0"><span>전환율 증가</span><span style="color:#10b981">+${convLift}%</span></div>
            <div style="display:flex;justify-content:space-between;font-size:.7rem;margin:.15rem 0"><span>순이익 영향</span><span style="color:${netImpact>=0?'#10b981':'#ef4444'}">${netImpact>=0?'+':''}${netImpact.toFixed(1)}%</span></div>
            <div style="display:flex;justify-content:space-between;font-size:.7rem;margin:.15rem 0"><span>위험 수준</span><span>${riskLevel}</span></div>
            <div style="background:rgba(255,255,255,.05);border-radius:4px;height:6px;margin-top:.3rem;overflow:hidden"><div style="height:100%;width:${Math.min(convLift*2,100)}%;background:linear-gradient(90deg,#10b981,#38bdf8);border-radius:4px"></div></div>
            <div style="font-size:.6rem;color:#64748b;margin-top:.2rem">예상 전환율 증가 바</div>
        </div>`;
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: create_coupon()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-terminal"></i> create_coupon</div>
        <div class="ai-card-details">• region: ${region} (${regionName})<br>• target: ${target} (${affectedProducts.length}개 상품)<br>• discount: -${disc}%<br>• auto_localize: true${profitBar}</div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execDiscount('${region}','${catFilter}',${disc},this)">✓ 승인 (Deploy)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=color:#ef4444>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }
    // ---- Intent 2: Bundle ----
    if(text.includes('번들') || text.includes('세트') || text.includes('묶')){
        let items=[];
        if(text.includes('세탁기')||text.includes('세탁')) items.push('washer');
        if(text.includes('냉장고')) items.push('fridge');
        if(text.includes('TV')||text.includes('OLED')||text.includes('올레드')) items.push('oled_evo');
        if(text.includes('사운드바')||text.includes('soundbar')) items.push('soundbar');
        if(text.includes('노트북')||text.includes('gram')||text.includes('그램')) items.push('gram');
        if(items.length<2) items=['oled_evo','soundbar'];
        const bp=items.map(id=>products.find(p=>p.id===id)).filter(Boolean);
        const tot=bp.reduce((s,p)=>s+p.price,0); const L=locales[currentStoreId]||locales.KR;
        const discM = text.match(/(\d+)%/); const bundleDisc = discM ? parseInt(discM[1]) : 10;
        let region=currentStoreId; if(text.includes('스페인')) region='ES';
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: create_bundle()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-boxes-stacked"></i> create_bundle</div>
        <div class="ai-card-details">• items: ${bp.map(p=>'<br>  └ '+p.name+' ('+fmt(p.price,L)+')').join('')}<br>• 정가 합계: ${fmt(tot,L)}<br>• 번들가(-${bundleDisc}%): <b>${fmt(tot*(1-bundleDisc/100),L)}</b><br>• 절약: <span style="color:#10b981">${fmt(tot*bundleDisc/100,L)}</span></div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execBundle('${items.join(',')}',${bundleDisc},'${region}',this)">✓ 승인 (Deploy)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=color:#ef4444>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }
    // ---- Intent 3: Price Change ----
    if(text.includes('가격') && (text.includes('바꿔')||text.includes('변경')||text.includes('등록')||text.includes('수정')||text.includes('만원')||text.includes('으로'))){
        // Find product
        let targetProduct = null;
        for(const p of products){ if(text.includes(p.name) || (p.id==='oled_evo' && (text.includes('OLED')||text.includes('올레드'))) || (p.id==='oled_m' && text.includes('SIGNATURE')) || (p.id==='gram' && (text.includes('gram')||text.includes('그램')||text.includes('노트북'))) || (p.id==='soundbar' && text.includes('사운드바')) || (p.id==='washer' && (text.includes('세탁기')||text.includes('트롬'))) || (p.id==='fridge' && (text.includes('냉장고')||text.includes('디오스')))){ targetProduct=p; break; } }
        // Find new price
        let newPrice = null;
        const priceM1 = text.match(/(\d+)\s*만\s*원/); if(priceM1) newPrice = parseInt(priceM1[1]) * 10000;
        const priceM2 = text.match(/(\d{1,3}(,\d{3})+)/); if(!newPrice && priceM2) newPrice = parseInt(priceM2[0].replace(/,/g,''));
        const priceM3 = text.match(/(\d{5,})/); if(!newPrice && priceM3) newPrice = parseInt(priceM3[1]);
        if(!targetProduct || !newPrice){
            addMsg(`가격 변경: 제품명과 새 가격을 명확히 입력해주세요.<br>예: <b>"OLED TV 가격을 350만원으로 바꿔줘"</b>`);
            return;
        }
        const L=locales[currentStoreId]||locales.KR;
        const diff = newPrice - targetProduct.price;
        const pctChange = ((diff/targetProduct.price)*100).toFixed(1);
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: update_price()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-won-sign"></i> update_price</div>
        <div class="ai-card-details">• product: ${targetProduct.name}<br>• 현재가: ${fmt(targetProduct.price,L)}<br>• 변경가: <b>${fmt(newPrice,L)}</b><br>• 변동: <span style="color:${diff>0?'#10b981':'#ef4444'}">${diff>0?'+':''}${pctChange}% (${diff>0?'+':''}${fmt(Math.abs(diff),L)})</span></div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execPrice('${targetProduct.id}',${newPrice},this)">✓ 승인 (Deploy)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=color:#ef4444>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }
    // ---- Intent 4: Country Rollout ----
    if(text.includes('사이트') || text.includes('롤아웃') || text.includes('개설') || text.includes('오픈') || text.includes('진출')){
        let targetCode=null, targetName=null;
        for(const [kw, code] of Object.entries(countryKeywords)){
            if(text.toLowerCase().includes(kw)){targetCode=code; targetName=locales[code]?.region || kw; break;}
        }
        if(!targetCode || targetCode===currentStoreId){
            addMsg(`국가를 명시해주세요.<br>예: <b>"스페인 사이트 개설해줘"</b><br>지원국가: 스페인, 영국, 일본, 독일, 프랑스, 브라질, 베트남`);
            return;
        }
        const L=locales[targetCode];
        const aiMsg=document.createElement('div'); aiMsg.className='message ai-message';
        aiMsg.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div>
        <div class="bubble"><b>✅ Intent: deploy_country()</b>
        <div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-globe"></i> deploy_country</div>
        <div class="ai-card-details">• target: ${L.region}<br>• domain: lg.com/${targetCode.toLowerCase()}<br>• currency: ${L.cur}<br>• language: auto-translate (AI)<br>• products: ${products.filter(p=>!p.bundleItems).length}개 상품 자동 변환<br>• estimated_time: ~30초 (기존 6개월 → AI 자동화)</div>
        <div style="display:flex;gap:.4rem">
            <button class="btn btn-approve" onclick="execRollout('${targetCode}',this)">✓ 승인 (Deploy)</button>
            <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=color:#ef4444>✗ 취소됨</span>'">✗ 취소</button>
        </div></div></div>`;
        chatContainer.appendChild(aiMsg); chatContainer.scrollTop=chatContainer.scrollHeight; return;
    }
    // Fallback
    setTimeout(()=>{
        addMsg(`아래 추천 명령어를 사용해 보세요:<br>
        <div class="suggestion-chips" style="margin-top:.5rem">
            <button class="chip" onclick="fillChat('블랙 프라이데이 다크 템플릿으로 바꿔줘')">🎨 전역 테마 변경</button>
            <button class="chip" onclick="fillChat('코드제로 무선청소기 신규 등록해줘')">🛍️ 신제품 생성</button>
            <button class="chip" onclick="fillChat('OLED TV 20% 할인 쿠폰 만들어줘')">🏷️ 할인 쿠폰 배포</button>
            <button class="chip" onclick="fillChat('스페인 사이트 개설해줘')">🌍 국가 롤아웃</button>
        </div>`);
    },500);
}

window.execDiscount = function(region,catFilter,disc,btn){
    currentStoreId=region;
    products.forEach(p=>{ if(catFilter==='all'||p.cat===catFilter) p.discount=disc; });
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> Live 배포 완료</span>';
    addMsg(`✅ <b>배포 완료.</b> 우측 스토어에서 확인하세요!<br>1. 할인 배지 실시간 반영<br>2. 상품 클릭 → 상세에서도 할인 적용`);
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

// ==================== NEW INTENT EXECS ====================
window.execTheme = function(themeId, btn){
    document.body.classList.add('black-friday');
    document.getElementById('promo1').textContent = 'BLACK FRIDAY SALE';
    document.getElementById('promo2').textContent = 'UP TO 50% OFF';
    document.getElementById('promo3').textContent = 'FREE SECURE SHIPPING';
    // add badge to all products
    products.forEach(p => { if(!p.discount) p.discount = 15; });
    // update label
    document.getElementById('heroLabel').textContent = 'BLACK FRIDAY EXCLUSIVE';
    document.getElementById('heroTitle').textContent = 'Unbelievable Deals';
    document.getElementById('heroDesc').textContent = 'Shop the best AI-powered electronics at the lowest prices of the year.';
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 테마 반영 완료</span>';
    addMsg(`✅ <b>전역 테마 업데이트 완료!</b><br>스토어가 블랙프라이데이 다크모드 및 프로모션 가격으로 자동 세팅되었습니다.`);
    renderStore(); document.getElementById('storePane').scrollTo({top:0,behavior:'smooth'});
};

window.execAddProduct = function(type, price, btn){
    const newItem = { id:'vac_'+Date.now(), cat:'Appliance', name:'LG 코드제로 오브제컬렉션 A9S', model:'AU9990', price:price, img:'washer.png', desc:'더 강력해진 흡입력과 AI 기반의 스마트 청정 스테이션을 경험하세요.', isNew:true };
    // placeholder image using washer.png
    products.unshift(newItem);
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 제품 등록 완료</span>';
    addMsg(`✅ <b>신제품 등록 완료!</b><br>🛍️ LG 코드제로 오브제컬렉션 A9S<br>스토어 상단에 즉시 노출되었습니다.`);
    activeFilter='all'; document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

// ==================== COUNTRY ROLLOUT ====================
window.execRollout = function(code, btn){
    btn.disabled = true;
    btn.textContent = '⏳ 배포 중...';
    const L = locales[code];
    const steps = [
        {icon:'🌐', text:`도메인 프로비저닝: lg.com/${code.toLowerCase()}`, delay:800},
        {icon:'🔒', text:'SSL 인증서 발급 완료', delay:600},
        {icon:'🎯', text:`현지화 설정: ${L.cur} / ${L.country}`, delay:700},
        {icon:'🤖', text:`AI 번역 엔진: ${products.filter(p=>!p.bundleItems).length}개 상품 자동 번역 중...`, delay:1200},
        {icon:'💱', text:`통화 변환: ₩ → ${L.cur} (환율 자동 적용)`, delay:600},
        {icon:'🛠️', text:'결제 게이트웨이 연동 완료', delay:500},
        {icon:'✅', text:`${L.region} 사이트 Live!`, delay:400}
    ];
    let progress = document.createElement('div');
    progress.className='message ai-message';
    progress.innerHTML=`<div class="avatar"><i class="fa-solid fa-sparkles"></i></div><div class="bubble"><b>🚀 국가 배포 진행 중...</b><div class="rollout-steps" id="rolloutSteps"></div></div>`;
    chatContainer.appendChild(progress);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const stepsEl = document.getElementById('rolloutSteps');
    let totalDelay = 0;
    steps.forEach((step, i) => {
        totalDelay += step.delay;
        setTimeout(()=>{
            stepsEl.innerHTML += `<div class="rollout-step">${step.icon} ${step.text}</div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            // On last step, switch the store
            if(i === steps.length - 1){
                setTimeout(()=>{
                    currentStoreId = code;
                    renderStore();
                    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 배포 완료</span>';
                    addMsg(`🎉 <b>${L.region} 사이트가 오픈되었습니다!</b><br><br>✅ 우측 스토어가 자동 전환되었습니다:<br>• 언어: ${L.country} 현지어<br>• 통화: ${L.cur}<br>• 배송/결제: 현지 적용<br><br>💡 <b>기존 6개월 → 30초</b>로 국가 개설 완료!`);
                    document.getElementById('storePane').scrollTo({top:0,behavior:'smooth'});
                },500);
            }
        }, totalDelay);
    });
};
window.execPrice = function(productId, newPrice, btn){
    const p = products.find(x=>x.id===productId);
    if(p){
        const L=locales[currentStoreId]||locales.KR;
        const oldPrice = p.price;
        p.price = newPrice;
        btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 가격 변경 완료</span>';
        addMsg(`✅ <b>${p.name}</b> 가격이 변경되었습니다.<br>${fmt(oldPrice,L)} → <b>${fmt(newPrice,L)}</b><br>🔄 우측 스토어에서 확인하세요!`);
        renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
    }
};
window.execBundle = function(itemIds,discRate,region,btn){
    const ids=itemIds.split(',');
    const bp=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
    const tot=bp.reduce((s,p)=>s+p.price,0);
    const bundleItems = bp.map(p=>({id:p.id, name:p.name, img:p.img, price:p.price}));
    products.unshift({ id:'bundle_'+Date.now(), cat:'Bundle', name:'LG 스페셜 번들', model:'BUNDLE-'+ids.join('-').toUpperCase(),
        price:tot, discount:discRate, img:bp[0].img, desc:bp.map(p=>p.name).join(' + ')+' 번들 패키지',
        bundleItems: bundleItems });
    if(region!==currentStoreId) currentStoreId=region;
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 번들 등록 완료</span>';
    addMsg(`✅ <b>번들 상품 생성 완료!</b><br>📦 ${bp.map(p=>p.name).join(' + ')}<br>할인: -${discRate}%`);
    activeFilter='all'; document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

sendBtn.addEventListener('click',()=>{ const v=chatInput.value.trim(); if(!v) return; addMsg(v,true); chatInput.value=''; setTimeout(()=>processIntent(v),600); });
chatInput.addEventListener('keypress',e=>{ if(e.key==='Enter') sendBtn.click(); });

// ==================== CS CHATBOT ====================
const csResponses = {
    '배송': '일반적으로 주문 후 2~3 영업일 내에 배송됩니다. 대형 가전(TV, 냉장고 등)은 설치 배송으로 별도 일정이 잡힙니다. 주문번호를 알려주시면 실시간 추적도 도와드릴게요!',
    '반품': '제품 수령 후 30일 이내에 반품이 가능합니다. 포장을 개봉하지 않은 상태가 가장 좋으며, 개봉 후에도 제품 하자 시 무상 교환/반품 처리해 드립니다.',
    '교환': '제품에 하자가 있는 경우, 제조일로부터 1년 이내 무상 교환이 가능합니다. 고객센터(1544-7777)로 연락 주시거나 여기서 바로 접수하실 수 있습니다.',
    '환불': '결제 취소 및 환불은 반품 접수 후 영업일 기준 3~5일 내에 원래 결제 수단으로 자동 환불됩니다.',
    'OLED': 'LG OLED TV는 자체 발광 소자를 사용하여 완벽한 블랙과 무한 명암비를 구현합니다. 시청 용도와 공간 크기에 따라 G4(갤러리형), C4(올라운더), M4(무선) 시리즈를 추천드립니다!',
    '가격': '제품별 가격은 사이트 상품 페이지에서 확인하실 수 있습니다. 현재 진행 중인 프로모션이 있을 수 있으니 확인해 보세요!',
    '할부': 'LG전자 공식 쇼핑몰에서는 최대 36개월 무이자 할부를 지원합니다. 카드사별 혜택이 다를 수 있으니 결제 시 확인해 주세요.',
    '보증': 'LG전자 제품은 기본 1년 무상 보증이 제공됩니다. 연장 보증 서비스(LG Care)를 통해 최대 5년까지 연장하실 수 있습니다.',
    '설치': '대형 가전(TV 55인치 이상, 냉장고, 세탁기)은 전문 설치 기사가 방문하여 무료 설치해 드립니다. 배송 시 일정을 조율합니다.'
};

window.toggleCsChat = function(){
    document.getElementById('csChatWindow').classList.toggle('open');
    document.getElementById('csFab').style.display = document.getElementById('csChatWindow').classList.contains('open') ? 'none' : 'flex';
};

window.sendCsMsg = function(){
    const input = document.getElementById('csInput');
    const val = input.value.trim(); if(!val) return;
    const msgs = document.getElementById('csChatMessages');
    // User message
    msgs.innerHTML += `<div class="cs-msg cs-user"><div class="cs-bubble">${val}</div></div>`;
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;
    // Bot response
    setTimeout(()=>{
        let reply = '죄송합니다, 해당 문의에 대한 정확한 답변을 찾지 못했습니다. 고객센터(1544-7777)로 연락 주시면 더 자세히 도와드리겠습니다.';
        for(const [key, resp] of Object.entries(csResponses)){
            if(val.includes(key)){ reply = resp; break; }
        }
        msgs.innerHTML += `<div class="cs-msg cs-bot"><div class="cs-bubble">${reply}</div></div>`;
        msgs.scrollTop = msgs.scrollHeight;
    }, 800);
};
document.getElementById('csInput').addEventListener('keypress',e=>{ if(e.key==='Enter') sendCsMsg(); });

// ==================== PAYMENT OPTION HIGHLIGHT ====================
document.querySelectorAll('.pay-option').forEach(opt=>{
    opt.addEventListener('click',()=>{
        document.querySelectorAll('.pay-option').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
    });
});

// ==================== INIT ====================
renderStore();
