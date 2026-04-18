// ==================== DATA ====================
let currentStoreId = 'UK';
let activeFilter = 'all';
let cart = [];
let currentModalProduct = null;
let sessionHistory = [];
let delegateDepth = 0; // [감사#1] delegate 무한루프 방어 카운터

// Products are loaded from data.js

const locales = {
    KR: { flag:'🇰🇷', region:'🇰🇷 대한민국', cur:'₩', rate:1700,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'모든 순간을 완벽하게.', heroDesc:'세계 최초 무선 올레드, 압도적 화질을 경험하세요.',
        cta:'지금 구매하기', heading:'인기 제품', buy:'장바구니 담기', cartTitle:'장바구니', total:'합계',
        checkout:'결제하기', placeOrder:'주문하기', orderDone:'주문 완료!', orderDesc:'주문이 성공적으로 접수되었습니다.',
        shipping:'배송 정보', payment:'결제 수단', country:'대한민국',
        p1:'무료 배송', p2:'무이자 할부', p3:'30일 반품 보장' },
    ES: { flag:'🇪🇸', region:'🇪🇸 España', cur:'€', rate:1.17,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfecto en cada momento.', heroDesc:'El primer OLED inalámbrico del mundo. Vive una calidad de imagen abrumadora.',
        cta:'Comprar Ahora', heading:'Productos Destacados', buy:'Añadir al Carrito', cartTitle:'Carrito', total:'Total',
        checkout:'Pagar', placeOrder:'Realizar Pedido', orderDone:'¡Pedido Confirmado!', orderDesc:'Su pedido ha sido realizado con éxito.',
        shipping:'Datos de Envío', payment:'Método de Pago', country:'España',
        p1:'Envío Gratis', p2:'Financiación sin intereses', p3:'30 días de devolución' },
    UK: { flag:'🇬🇧', region:'🇬🇧 United Kingdom', cur:'£', rate:1,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Innovation for a Better Life.', heroDesc:'Discover the world\'s first wireless OLED.',
        cta:'Shop Now', heading:'Trending Products', buy:'Add to Basket', cartTitle:'Shopping Cart', total:'Total',
        checkout:'Checkout', placeOrder:'Place Order', orderDone:'Order Confirmed!', orderDesc:'Your order has been placed successfully.',
        shipping:'Shipping Details', payment:'Payment', country:'United Kingdom',
        p1:'Free Delivery', p2:'Interest-Free Credit', p3:'30-Day Returns' },
    JP: { flag:'🇯🇵', region:'🇯🇵 日本', cur:'¥', rate:190,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'すべての瞬間を完璧に。', heroDesc:'世界初のワイヤレス有機ELテレビ。圧倒的な画質を体験。',
        cta:'今すぐ購入', heading:'人気製品', buy:'カートに入れる', cartTitle:'カート', total:'合計',
        checkout:'お支払い', placeOrder:'注文する', orderDone:'注文確定！', orderDesc:'ご注文を承りました。',
        shipping:'配送情報', payment:'お支払い方法', country:'日本',
        p1:'送料無料', p2:'分割払い対応', p3:'30日間返品可能' },
    DE: { flag:'🇩🇪', region:'🇩🇪 Deutschland', cur:'€', rate:1.17,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfektion in jedem Moment.', heroDesc:'Der weltweit erste kabellose OLED-TV. Erleben Sie überragende Bildqualität.',
        cta:'Jetzt Kaufen', heading:'Beliebte Produkte', buy:'In den Warenkorb', cartTitle:'Warenkorb', total:'Gesamt',
        checkout:'Zur Kasse', placeOrder:'Bestellen', orderDone:'Bestellung Bestätigt!', orderDesc:'Ihre Bestellung wurde erfolgreich aufgegeben.',
        shipping:'Lieferadresse', payment:'Zahlungsmethode', country:'Deutschland',
        p1:'Kostenloser Versand', p2:'Ratenzahlung', p3:'30 Tage Rückgabe' },
    FR: { flag:'🇫🇷', region:'🇫🇷 France', cur:'€', rate:1.17,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'La perfection à chaque instant.', heroDesc:'Le premier téléviseur OLED sans fil au monde.',
        cta:'Acheter', heading:'Produits Populaires', buy:'Ajouter au Panier', cartTitle:'Panier', total:'Total',
        checkout:'Paiement', placeOrder:'Commander', orderDone:'Commande Confirmée!', orderDesc:'Votre commande a été passée.',
        shipping:'Adresse de Livraison', payment:'Mode de Paiement', country:'France',
        p1:'Livraison Gratuite', p2:'Paiement en 3x', p3:'Retour sous 30 jours' },
    BR: { flag:'🇧🇷', region:'🇧🇷 Brasil', cur:'R$', rate:6.4,
        heroLabel:'LG SIGNATURE OLED M4', heroTitle:'Perfeição em cada momento.', heroDesc:'A primeira TV OLED sem fio do mundo.',
        cta:'Comprar Agora', heading:'Produtos em Destaque', buy:'Adicionar ao Carrinho', cartTitle:'Carrinho', total:'Total',
        checkout:'Pagamento', placeOrder:'Finalizar Pedido', orderDone:'Pedido Confirmado!', orderDesc:'Seu pedido foi realizado com sucesso.',
        shipping:'Endereço de Entrega', payment:'Forma de Pagamento', country:'Brasil',
        p1:'Frete Grátis', p2:'Parcelamento sem juros', p3:'30 dias para devolução' },
    VN: { flag:'🇻🇳', region:'🇻🇳 Việt Nam', cur:'₫', rate:32000,
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
    const fragment = document.createDocumentFragment(); // [감사#3] DocumentFragment로 일괄 추가
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
            const card = document.createElement('div');
            card.className = 'product-card bundle-card';
            card.onclick = () => openModal(p.id);
            card.innerHTML = `${badge}
                <div class="bundle-img-grid">${imgGrid}</div>
                <div class="pc-body">
                    <div class="pc-cat"><i class="fa-solid fa-boxes-stacked"></i> BUNDLE DEAL</div>
                    <div class="pc-name">${p.name}</div>
                    <div class="bundle-composition">${p.bundleItems.map(bi=>bi.name).join(' + ')}</div>
                    <div class="pc-prices"><span class="pc-price">${displayPrice}</span>${orig}</div>
                    <div class="bundle-savings"><i class="fa-solid fa-tag"></i> ${savings} 절약!</div>
                    <button class="pc-buy" onclick="event.stopPropagation();addToCart('${p.id}')">
                        <i class="fa-solid fa-cart-plus"></i> ${L.buy}
                    </button>
                </div>`;
            fragment.appendChild(card);
        } else {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => openModal(p.id);
            card.innerHTML = `<div class="pc-img">${badge}<img src="${p.img}" alt="${p.name}" loading="lazy"></div>
                <div class="pc-body">
                    <div class="pc-cat">${p.cat}</div>
                    <div class="pc-name">${p.name}</div>
                    <div style="color:#fbbf24;font-size:0.75rem;margin-bottom:0.5rem;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i> <span style="color:#777;font-weight:600;margin-left:4px">4.8 (1,284)</span></div>
                    <div class="pc-prices"><span class="pc-price">${displayPrice}</span>${orig}</div>
                    <div style="font-size:0.7rem;color:var(--success);font-weight:700;margin-bottom:.8rem;"><i class="fa-solid fa-bolt"></i> 무료 당일 배송 (Free Express)</div>
                    <button class="pc-buy" onclick="event.stopPropagation();addToCart('${p.id}')">
                        <i class="fa-solid fa-cart-plus"></i> ${L.buy}
                    </button>
                </div>`;
            fragment.appendChild(card);
        }
    });
    productGrid.innerHTML = ''; // [감사#3] 한번에 교체
    productGrid.appendChild(fragment);
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
let currentAgentIconUrl = '';
let currentActiveAgentId = 'atlas';

function addMsg(text, isUser=false, agentId=null) {
    const d=document.createElement('div');
    d.className=`message ${isUser?'user-message':'ai-message'}`;
    let avatarHTML = '';
    
    if(isUser) {
        avatarHTML = `<div class="avatar"><i class="fa-solid fa-user"></i></div>`;
    } else {
        if(agentId) {
            avatarHTML = getAgentAvatarHTML(agentId);
        } else {
            const renderUrl = currentAgentIconUrl;
            if (renderUrl) {
                avatarHTML = `<div class="avatar" style="background:transparent; padding:0; overflow:hidden;"><img src="${renderUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"></div>`;
            } else {
                avatarHTML = `<div class="avatar atlas-chat"><i class="fa-solid fa-robot"></i></div>`;
            }
        }
    }
    
    d.innerHTML=`${avatarHTML}<div class="bubble">${text}</div>`;
    chatContainer.appendChild(d); chatContainer.scrollTop=chatContainer.scrollHeight;
}
window.fillChat = function(txt){ chatInput.value=txt; chatInput.focus(); };

function getAgentAvatarHTML(agentId) {
    let url = '';
    if(agentId === 'atlas') return `<div class="avatar atlas-chat"><i class="fa-solid fa-robot"></i></div>`;
    else if(agentId === 'product') url = 'assets/images/agents/product_agent_v6.png';
    else if(agentId === 'md') url = 'assets/images/agents/md_agent_v6.png';
    else if(agentId === 'promo') url = 'assets/images/agents/promo_agent.png';
    else if(agentId === 'price') url = 'assets/images/agents/price_agent.png';
    else if(agentId === 'site') url = 'assets/images/agents/site_agent.png';
    else url = 'assets/images/agents/' + agentId + '_agent.png';
    return `<div class="avatar" style="background:transparent; padding:0; overflow:hidden;"><img src="${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"></div>`;
}

async function processIntent(text){
    const typingId = 'typing_' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message ai-message';
    typingMsg.id = typingId;
    typingMsg.innerHTML = `${getAgentAvatarHTML(currentActiveAgentId)}<div class="bubble"><i class="fa-solid fa-circle-notch fa-spin"></i> (AI 분석 중...)</div>`;
    chatContainer.appendChild(typingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // [감사#7] 체인 프롬프트는 히스토리에 저장하지 않음
        const isChainPrompt = text.startsWith('[시스템 자동 전달]');
        if (!isChainPrompt) {
            sessionHistory.push({ role: 'user', parts: [{ text }] });
        }
        if (sessionHistory.length > 6) {
            sessionHistory = sessionHistory.slice(sessionHistory.length - 6);
        }

        // [감사#4] 도구가 필요한 에이전트만 상품 DB 전송 (토큰 절약)
        const toolAgents = ['atlas','price','promo','product','md'];
        let storeState = null;
        if (toolAgents.includes(currentActiveAgentId)) {
            storeState = products.map(p => 
                `${p.id}|${p.name}|${p.cat}|${p.bundleItems?'B':'S'}|${p.discount?'-'+p.discount+'%':''}`
            ).join('\n');
        }

        const payload = { text, activeAgent: currentActiveAgentId, history: sessionHistory, storeState };
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        const tEl = document.getElementById(typingId);
        if(tEl) tEl.remove();

        if (data.error) {
            addMsg(`오류 발생: ${data.error}`, false, currentActiveAgentId);
            return;
        }

        if (data.type === 'text') {
            sessionHistory.push({ role: 'model', parts: [{ text: data.text }] });
            addMsg(data.text, false, currentActiveAgentId);
        } else if (data.type === 'function_call') {
            const { args } = data;
            const name = data.name.trim(); // 앵무새 오류 방지를 위해 trim() 적용
            
            // 시스템 로그 앵무새 방지: 자연어로 문맥 기억
            if(name === 'delegate_task') {
                sessionHistory.push({ role: 'model', parts: [{ text: `네, ${args.target_agent} 담당자에게 해당 업무를 즉시 이관하겠습니다.` }] });
            } else {
                sessionHistory.push({ role: 'model', parts: [{ text: `요청하신 ${name} 작업을 처리하기 위해 화면에 실행 카드를 띄웠습니다.` }] });
            }

            const L = locales[currentStoreId] || locales.KR;

            let aiMsg = document.createElement('div'); 
            aiMsg.className = 'message ai-message';
            let inner = `${getAgentAvatarHTML(currentActiveAgentId)}<div class="bubble"><b>✅ Intent: ${name}()</b>`;
            
            if (name === 'create_coupon') {
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-ticket-simple"></i> create_coupon</div>
                <div class="ai-card-details">• region: ${args.region}<br>• target: ${args.category}<br>• discount: -${args.discount_pct}%</div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execDiscount('${args.region}','${args.category}',${args.discount_pct},this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'create_bundle') {
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-boxes-stacked"></i> create_bundle</div>
                <div class="ai-card-details">• items: ${args.items}<br>• region: ${args.region}<br>• discount: -${args.discount_pct}%</div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execBundle('${args.items}',${args.discount_pct},'${args.region}',this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'update_discount') {
                let targetProduct = products.find(p => p.name.toLowerCase().includes((args.product_name || '').toLowerCase().replace(/lg /g,'')));
                if(!targetProduct) targetProduct = products[0]; 
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-tag"></i> update_discount</div>
                <div class="ai-card-details">• product: ${targetProduct.name}<br>• 할인율: <b>${args.discount_pct}%</b><br>• 할인가: <span style="color:#10b981">${fmt(targetProduct.price * (1 - args.discount_pct/100), L)}</span></div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execProductDiscount('${targetProduct.id}',${args.discount_pct},this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'set_standard_price') {
                let targetProduct = products.find(p => p.name.toLowerCase().includes((args.product_name || '').toLowerCase().replace(/lg /g,'')));
                if(!targetProduct) targetProduct = products[0];
                const newPrice = args.new_price || 0;
                const diff = newPrice - targetProduct.price;
                const pctChange = ((diff/targetProduct.price)*100).toFixed(1);
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-coins"></i> set_standard_price</div>
                <div class="ai-card-details">• product: ${targetProduct.name}<br>• 기존가: ${fmt(targetProduct.price, L)}<br>• 신규가: <b>${fmt(newPrice, L)}</b><br>• 변동: <span style="color:${diff>0?'#ef4444':'#10b981'}">${diff>0?'+':''}${pctChange}%</span></div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execPrice('${targetProduct.id}',${newPrice},this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'change_theme') {
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-palette"></i> change_theme</div>
                <div class="ai-card-details">• theme_name: ${args.theme_name}</div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execTheme('${args.theme_name}',this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'deploy_country') {
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-globe"></i> deploy_country</div>
                <div class="ai-card-details">• country_code: ${args.country_code}</div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execRollout('${args.country_code}',this,'${currentActiveAgentId}')">✓ 승인 (Deploy)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'update_inventory') {
                const target = args.sku || '전체 상품';
                const qty = args.quantity || 5;
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-boxes-stacked"></i> update_inventory</div>
                <div class="ai-card-details">• target: <b>${target}</b><br>• quantity: <b>${qty} EA</b></div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execUpdateInventory('${target}', ${qty}, this, '${currentActiveAgentId}')">✓ 승인 (Update)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'add_product') {
                const pPrice = args.price || 1250000;
                const pName = args.name || 'LG 신제품';
                const pCat = args.category || 'Appliance';
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-plus-circle"></i> add_product</div>
                <div class="ai-card-details">• product_name: <b>${pName}</b><br>• price: <b>${fmt(pPrice, L)}</b></div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execAddProduct('${pName}', '${pCat}', ${pPrice}, this, '${currentActiveAgentId}')">✓ 승인 (Publish)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'reorder_catalog') {
                inner += `<div class="ai-card"><div class="ai-card-title"><i class="fa-solid fa-list-ol"></i> reorder_catalog</div>
                <div class="ai-card-details">• target_type: ${args.target_type}<br>이 카테고리의 상품을 최상단으로 끌어올립니다.</div>
                <div style="display:flex;gap:.4rem">
                    <button class="btn btn-approve" onclick="execReorder('${args.target_type}', this, '${currentActiveAgentId}')">✓ 승인 (진열 변경)</button>
                    <button class="btn btn-reject" onclick="this.parentElement.parentElement.innerHTML='<span style=\\'color:#ef4444\\'>✗ 취소됨</span>'">✗ 취소</button>
                </div></div>`;
            } else if (name === 'delegate_task') {
                const targetAgent = args.target_agent.toLowerCase();
                inner += `<div class="ai-card" style="border-left-color: #f59e0b;"><div class="ai-card-title"><i class="fa-solid fa-handshake-angle"></i> 업무 이관 (Delegate)</div>
                <div class="ai-card-details">해당 업무를 관련 부서로 이관 중입니다...<br>• 타겟 분과: <b>${targetAgent.toUpperCase()}</b><br>• 전달 사항: "${args.task_description}"</div>
                </div>`;
                
                // [감사#1] 무한 위임 루프 방어
                if (delegateDepth >= 2) {
                    addMsg(`⚠️ 위임 체인이 최대 깊이(2회)에 도달했습니다. 추가 위임을 중단합니다.`, false, currentActiveAgentId);
                } else {
                    delegateDepth++;
                    setTimeout(() => {
                        switchAgent(targetAgent);
                        const chainPrompt = `[시스템 자동 전달] 타 에이전트로부터 업무가 이관되었습니다. 지시사항: "${args.task_description}". 사용자를 향해 짧게 인수인계 인사 후, 즉시 당신의 도구(Tool)를 호출하여 작업을 완료하세요.`;
                        processIntent(chainPrompt);
                    }, 1500);
                }
            } else {
                inner += `알 수 없는명령입니다.</div>`;
            }
            
            inner += `</div>`;
            aiMsg.innerHTML = inner;
            chatContainer.appendChild(aiMsg); 
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

    } catch(e) {
        const tEl = document.getElementById(typingId);
        if(tEl) tEl.remove();
        console.error(e);
        addMsg(`네트워크 오류가 발생했습니다. 로컬에서는 API 지원이 어려울 수 있으니 Deploy 후 확인바랍니다.`, false, 'atlas');
    }
}

window.switchAgent = function(id, el) {
    document.querySelectorAll('.agent-item').forEach(item => item.classList.remove('active'));
    
    // 자동 스위칭(el이 없는 경우) DOM에서 타겟 엘리먼트 수동 찾기
    if(!el) {
        el = Array.from(document.querySelectorAll('.agent-item')).find(item => item.getAttribute('onclick').includes(`'${id}'`));
    }
    if(el) el.classList.add('active');
    
    currentActiveAgentId = id;
    
    // Change chips dynamically based on agent
    let chipsHTML = '';
    const nameMap = {
        'atlas': 'Chief AI (Atlas)',
        'promo': '프로모션 에이전트',
        'price': '가격 에이전트',
        'product': '제품 에이전트',
        'site': '사이트 에이전트',
        'md': 'MD 에이전트',
        'marketing': '마케팅 에이전트'
    };
    
    if(id === 'promo') {
        chipsHTML = `
            <button class="chip" onclick="fillChat('최고급 OLED TV와 사운드바를 20% 할인된 번들로 구성해줘')">📦 번들 시스템 마이그레이션</button>
            <button class="chip" onclick="fillChat('OLED TV 20% 할인 쿠폰 만들어줘')">🎫 고객 타겟팅 쿠폰 배포</button>
        `;
    } else if(id === 'price') {
        chipsHTML = `
            <button class="chip" onclick="fillChat('OLED M4 15% 할인 세팅해줘')">🏷️ 실시간 탄력 할인가 배포</button>
            <button class="chip" onclick="fillChat('OLED M4 모델 5000 파운드로 표준 가격 등록해줘')">💰 기준가 동기화</button>
        `;
    } else if(id === 'site') {
        chipsHTML = `
            <button class="chip" onclick="fillChat('스페인 사이트 개설해줘')">🌍 스페인 리전 자동 롤아웃</button>
            <button class="chip" onclick="fillChat('블랙 프라이데이 다크 템플릿으로 바꿔줘')">🎨 전역 테마 동기화</button>
        `;
    } else if(id === 'product' || id === 'md' || id === 'marketing') {
        chipsHTML = `
            <button class="chip" onclick="fillChat('코드제로 무선청소기 신규 등록해줘')">🛍️ 신상품 마스터 생성</button>
            <button class="chip" onclick="fillChat('묶음 상품들을 맨 첫줄에 리스트해줘')">⭐ 번들 상품 상단 진열</button>
        `;
    } else {
        chipsHTML = `
            <button class="chip" onclick="fillChat('OLED M4 15% 할인 세팅해줘')">🏷️ 퀵 액션: 할인</button>
            <button class="chip" onclick="fillChat('스페인 사이트 개설해줘')">🌍 퀵 액션: 국가 롤아웃</button>
        `;
    }

    if(id==='atlas') { currentAgentIconUrl = ''; }
    else { currentAgentIconUrl = document.getElementById('avatar_'+id)?.src || ''; }

    addMsg(`🤖 <b>[${nameMap[id]}] 활성화됨.</b><br>해당 분야에 대한 자연어 명령을 대기 중입니다.<br>
        <div class="suggestion-chips" style="margin-top:.5rem">
            ${chipsHTML}
        </div>`, false, id);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Fallback hint update
function showFallback() {
    setTimeout(()=>{
        addMsg(`아래 추천 명령어를 사용해 보세요:<br>
        <div class="suggestion-chips" style="margin-top:.5rem">
            <button class="chip" onclick="fillChat('OLED M4 15% 할인 세팅해줘')">🏷️ 실시간 할인 폭격</button>
            <button class="chip" onclick="fillChat('OLED M4 모델 5000 파운드로 표준 가격 등록해줘')">💰 표준 가격 등록</button>
            <button class="chip" onclick="fillChat('최고급 OLED TV와 사운드바를 20% 할인된 번들로 구성해줘')">📦 번들 자동 생성</button>
            <button class="chip" onclick="fillChat('스페인 사이트 개설해줘')">🌍 국가 롤아웃</button>
            <button class="chip" onclick="fillChat('블랙 프라이데이 다크 템플릿으로 바꿔줘')">🎨 전역 테마 교체</button>
        </div>`);
    },500);
}

window.execDiscount = function(region,catFilter,disc,btn,agentId){
    currentStoreId=region;
    products.forEach(p=>{ if(catFilter==='all'||p.cat===catFilter) p.discount=disc; });
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> Live 배포 완료</span>';
    addMsg(`✅ <b>배포 완료.</b> 우측 스토어에서 확인하세요!<br>1. 할인 배지 실시간 반영<br>2. 상품 클릭 → 상세에서도 할인 적용`, false, agentId);
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

window.execProductDiscount = function(id, disc, btn, agentId){
    const p = products.find(x => x.id === id);
    if(p) p.discount = disc;
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 실시간 할인 반영 완료</span>';
    addMsg(`✅ <b>[${p.name}] ${disc}% 할인 적용 완료.</b><br>메인 스토어에 표기되었습니다.`, false, agentId);
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};


// ==================== NEW INTENT EXECS ====================

window.execTheme = function(themeId, btn, agentId){
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
    addMsg(`✅ <b>전역 테마 업데이트 완료!</b><br>스토어가 블랙프라이데이 다크모드 및 프로모션 가격으로 자동 세팅되었습니다.`, false, agentId);
    renderStore(); document.getElementById('storePane').scrollTo({top:0,behavior:'smooth'});
};

window.execAddProduct = function(pName, pCat, price, btn, agentId){
    let imgPath = 'assets/images/products/fridge.png';
    if((pName||'').includes('코드제로') || (pName||'').includes('청소기')) imgPath = 'assets/images/products/vacuum.jpg';
    if((pName||'').includes('디오스') || (pName||'').includes('매직스페이스')) imgPath = 'assets/images/products/instaview_real.png';
    if((pName||'').includes('OLED') || (pName||'').includes('TV')) imgPath = 'assets/images/products/oled_tv_real.png';
    
    const newItem = { id:'prod_'+Date.now(), cat:pCat, name:pName, model:'NEW-2026', price:price, img:imgPath, desc:'LG의 최신 혁신 기술이 적용된 프리미엄 모델입니다.', isNew:true };
    products.unshift(newItem);
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 제품 등록 완료</span>';
    addMsg(`✅ <b>신제품 등록 완료!</b><br>🛍️ ${pName}<br>스토어 상단에 즉시 노출되었습니다.`, false, agentId);
    activeFilter='all'; document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

// ==================== COUNTRY ROLLOUT ====================
window.execRollout = function(code, btn, agentId){
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
    progress.innerHTML=`${agentId ? getAgentAvatarHTML(agentId) : getAgentAvatarHTML('site')}<div class="bubble"><b>🚀 국가 배포 진행 중...</b><div class="rollout-steps" id="rolloutSteps"></div></div>`;
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
                    addMsg(`🎉 <b>${L.region} 사이트가 오픈되었습니다!</b><br><br>✅ 우측 스토어가 자동 전환되었습니다:<br>• 언어: ${L.country} 현지어<br>• 통화: ${L.cur}<br>• 배송/결제: 현지 적용<br><br>💡 <b>기존 6개월 → 30초</b>로 국가 개설 완료!`, false, agentId);
                    document.getElementById('storePane').scrollTo({top:0,behavior:'smooth'});
                },500);
            }
        }, totalDelay);
    });
};
window.execPrice = function(productId, newPrice, btn, agentId){
    const p = products.find(x=>x.id===productId);
    if(p){
        const L=locales[currentStoreId]||locales.KR;
        const oldPrice = p.price;
        p.price = newPrice;
        p.discount = 0; // reset discount on standard price change
        btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 가격 변경 완료</span>';
        addMsg(`✅ <b>${p.name}</b> 가격이 변경되었습니다.<br>${fmt(oldPrice,L)} → <b>${fmt(newPrice,L)}</b><br>🔄 우측 스토어에서 확인하세요!`, false, agentId);
        renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
    }
};
window.execBundle = function(itemIds,discRate,region,btn,agentId){
    const ids=itemIds.split(',');
    const bp=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
    const tot=bp.reduce((s,p)=>s+p.price,0);
    const bundleItems = bp.map(p=>({id:p.id, name:p.name, img:p.img, price:p.price}));
    products.unshift({ id:'bundle_'+Date.now(), cat:'Bundle', name:'LG 스페셜 번들', model:'BUNDLE-'+ids.join('-').toUpperCase(),
        price:tot, discount:discRate, img:bp[0].img, desc:bp.map(p=>p.name).join(' + ')+' 번들 패키지',
        bundleItems: bundleItems });
    if(region!==currentStoreId) currentStoreId=region;
    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 번들 등록 완료</span>';
    addMsg(`✅ <b>번들 상품 생성 완료!</b><br>📦 ${bp.map(p=>p.name).join(' + ')}<br>할인: -${discRate}%`, false, agentId);
    activeFilter='all'; document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    renderStore(); document.querySelector('.product-section').scrollIntoView({behavior:'smooth'});
};

// [감사#2] execReorder 통합 (중복 제거)
window.execReorder = function(targetType, btn, agentId){
    const type = targetType.toLowerCase();
    
    if (type.includes('bundle') || type.includes('묶음')) {
        const bundles = products.filter(p => p.bundleItems);
        const nonBundles = products.filter(p => !p.bundleItems);
        products.length = 0;
        products.push(...bundles, ...nonBundles);
    } else if (type.includes('new') || type.includes('신상')) {
        const news = products.filter(p => p.isNew);
        const olds = products.filter(p => !p.isNew);
        products.length = 0;
        products.push(...news, ...olds);
    } else {
        // 기타: 할인율 높은 순으로 정렬
        products.sort((a, b) => (b.discount||0) - (a.discount||0));
    }

    btn.parentElement.parentElement.innerHTML='<span style="color:#10b981;font-weight:700"><i class="fa-solid fa-check-circle"></i> 진열 순서 변경 완료</span>';
    addMsg(`✅ <b>진열 순서 재전개 완료!</b><br>요청하신 <b>${targetType}</b> 조건에 맞는 상품들이 스토어 최상단으로 끌어올려졌습니다. 우측 스토어 상단을 확인해 보세요!`, false, agentId);
    activeFilter='all'; document.querySelectorAll('.gnb-link').forEach(l=>l.classList.remove('active'));
    document.querySelector('[data-cat="all"]').classList.add('active');
    renderStore();
    document.getElementById('storePane').scrollTo({top:0,behavior:'smooth'});
};

sendBtn.addEventListener('click',()=>{ const v=chatInput.value.trim(); if(!v) return; delegateDepth=0; addMsg(v,true); chatInput.value=''; setTimeout(()=>processIntent(v),600); }); // [감사#1] 새 대화 시작 시 delegateDepth 초기화
chatInput.addEventListener('keypress',e=>{ if(e.key==='Enter') sendBtn.click(); });

// ==================== ATLAS CHATBOT ====================
const atlasChatWindow = document.getElementById('chat-window');
const atlasChatBox = document.getElementById('chat-box');
const atlasInputWrapper = document.getElementById('atlas-chat-input-wrapper');
const atlasUserInput = atlasInputWrapper ? atlasInputWrapper.querySelector('#user-input') : null;
const atlasSendBtn = atlasInputWrapper ? atlasInputWrapper.querySelector('#send-btn') : null;
const atlasCanvas = document.getElementById('atlasCanvas');
const atlasCtx = atlasCanvas ? atlasCanvas.getContext('2d') : null;

// CS 채팅 버블 추가용 헬퍼 함수
function addCsMsg(text, isUser=false) {
    const d=document.createElement('div');
    d.className=`msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    d.innerHTML = text;
    if(atlasChatBox) {
        atlasChatBox.appendChild(d);
        atlasChatBox.scrollTop = atlasChatBox.scrollHeight;
    }
}

// CS 봇 MCP 연동 메인 프로세스
let csHistory = [];
async function processCSIntent(text) {
    const typingId = 'cstyping_' + Date.now();
    addCsMsg(`<i class="fa-solid fa-circle-notch fa-spin"></i> 분석 중...`, false);
    const typingEl = atlasChatBox.lastChild;

    try {
        csHistory.push({ role: 'user', parts: [{ text }] });
        if (csHistory.length > 6) csHistory = csHistory.slice(-6);

        const payload = { text, activeAgent: 'atlas_cs', history: csHistory };
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        typingEl.remove();

        if (data.error) {
            addCsMsg(`오류: MCP 통신 불가 (${data.error})`, false);
            return;
        }

        if (data.type === 'text') {
            csHistory.push({ role: 'model', parts: [{ text: data.text }] });
            addCsMsg(data.text, false);
        } else if (data.type === 'function_call') {
            // MCP 도구 실행 결과(ExecutionResult)가 함께 반환됨!
            const resultObj = data.executionResult || {};
            const resultMsg = resultObj.message || `[${data.name}] 처리 완료`;
            
            csHistory.push({ role: 'model', parts: [{ text: resultMsg }] });
            
            // 아름다운 UI 포맷팅
            const styledHtml = `<div style="background:#0a0a0a; border:1px solid #333; padding:10px; border-radius:6px; margin-top:5px;">
                <div style="font-size:0.7rem; color:#888; margin-bottom:5px;">⚙️ MCP Tool Execution: ${data.name}</div>
                <div style="color:#10b981;">${resultMsg}</div>
            </div>`;
            addCsMsg(styledHtml, false);
        }

    } catch(e) {
        typingEl.remove();
        console.error(e);
        addCsMsg(`연결 장애: ${e.message}`, false);
    }
}

if(atlasSendBtn && atlasUserInput) {
    atlasSendBtn.addEventListener('click', () => { 
        const v = atlasUserInput.value.trim(); 
        if(!v) return; 
        addCsMsg(v, true); 
        atlasUserInput.value=''; 
        isSpeaking = true;
        setTimeout(() => processCSIntent(v), 300); 
        setTimeout(() => isSpeaking = false, 3000); // 임시 입모양 플래그
    });
    atlasUserInput.addEventListener('keypress', e => { if(e.key === 'Enter') atlasSendBtn.click(); });
}

let isSpeaking = false;
let atlasFrame = 0;
let blinkTimer = 0;
let eyeOpenness = 1;

function drawAtlas() {
    if(!atlasCtx) return;
    atlasCtx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    const centerX = atlasCanvas.width / 2;
    const centerY = 75; 
    atlasFrame++;

    const speed = 0.03;
    const breatheY = Math.sin(atlasFrame * speed) * 2;
    const swayX = Math.sin(atlasFrame * speed * 0.5) * 1.5;
    const headPanX = Math.sin(atlasFrame * speed * 0.7) * 2.5;
    const armSwing = Math.sin(atlasFrame * speed * 1.2) * 4; 

    if (blinkTimer > 0) {
        blinkTimer--;
        eyeOpenness = (blinkTimer > 10 || blinkTimer < 3) ? 0.3 : 0;
    } else {
        eyeOpenness = 1;
        if (Math.random() < 0.015) blinkTimer = 15;
    }

    atlasCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    atlasCtx.beginPath();
    atlasCtx.ellipse(centerX + swayX*0.5, centerY + 75, 28 + breatheY, 4, 0, 0, Math.PI * 2);
    atlasCtx.fill();

    function drawLimb(startX, startY, swingX, isBack, isArm) {
        const zColor = isBack ? '#666' : '#d4d4d4'; 
        const jointColor = isBack ? '#1a1a1a' : '#2a2a2a';
        const length1 = isArm ? 18 : 22; 
        const length2 = isArm ? 18 : 24; 
        const midX = startX + swingX;
        const midY = startY + length1;
        const endX = startX + swingX * (isArm ? 1.5 : -0.2);
        const endY = midY + length2;

        atlasCtx.strokeStyle = jointColor; 
        atlasCtx.lineWidth = isArm ? 5 : 7; 
        atlasCtx.lineCap = 'round';
        atlasCtx.lineJoin = 'round';
        atlasCtx.beginPath(); atlasCtx.moveTo(startX, startY); atlasCtx.lineTo(midX, midY); atlasCtx.lineTo(endX, endY); atlasCtx.stroke();

        atlasCtx.fillStyle = zColor;
        if (!isArm) {
            atlasCtx.beginPath(); atlasCtx.roundRect(startX - 5 + swingX*0.5, startY + 2, 10, length1 - 4, 3); atlasCtx.fill();
            atlasCtx.beginPath(); atlasCtx.roundRect(endX - 4 + (midX-endX)*0.5, midY + 2, 8, length2 - 4, 2); atlasCtx.fill();
            atlasCtx.fillStyle = jointColor;
            atlasCtx.beginPath(); atlasCtx.roundRect(endX - 8, endY, 16, 7, 3); atlasCtx.fill();
        } else {
            atlasCtx.beginPath(); atlasCtx.roundRect(startX - 7, startY - 7, 14, 12, 4); atlasCtx.fill();
            atlasCtx.beginPath(); atlasCtx.roundRect(endX - 3.5 + (midX-endX)*0.5, midY + 2, 7, length2 - 6, 2); atlasCtx.fill();
            atlasCtx.fillStyle = jointColor;
            atlasCtx.beginPath(); atlasCtx.arc(endX, endY, 4, 0, Math.PI*2); atlasCtx.fill();
        }

        atlasCtx.fillStyle = '#111';
        atlasCtx.beginPath(); atlasCtx.arc(midX, midY, isArm ? 3 : 4, 0, Math.PI*2); atlasCtx.fill();
    }

    const bodyX = centerX + swayX;
    const bodyY = centerY + breatheY;

    drawLimb(bodyX + 14, bodyY + 25, -2, true, false);
    drawLimb(bodyX + 22, bodyY - 10, -armSwing, true, true);

    atlasCtx.fillStyle = '#333';
    atlasCtx.beginPath(); atlasCtx.roundRect(bodyX - 14, bodyY + 16, 28, 14, 4); atlasCtx.fill();
    
    atlasCtx.fillStyle = '#222';
    atlasCtx.fillRect(bodyX - 8, bodyY + 5, 16, 14);
    atlasCtx.strokeStyle = '#666'; atlasCtx.lineWidth = 2;
    atlasCtx.beginPath(); atlasCtx.moveTo(bodyX-4, bodyY+5); atlasCtx.lineTo(bodyX-4, bodyY+18); atlasCtx.stroke();
    atlasCtx.beginPath(); atlasCtx.moveTo(bodyX+4, bodyY+5); atlasCtx.lineTo(bodyX+4, bodyY+18); atlasCtx.stroke();

    atlasCtx.fillStyle = '#eee';
    atlasCtx.beginPath();
    atlasCtx.moveTo(bodyX - 20, bodyY - 15);
    atlasCtx.lineTo(bodyX + 20, bodyY - 15);
    atlasCtx.lineTo(bodyX + 16, bodyY + 8);
    atlasCtx.lineTo(bodyX - 16, bodyY + 8);
    atlasCtx.closePath();
    atlasCtx.fill();
    
    atlasCtx.fillStyle = '#222';
    atlasCtx.beginPath(); atlasCtx.roundRect(bodyX - 10, bodyY - 8, 20, 8, 2); atlasCtx.fill();
    atlasCtx.fillStyle = '#00b0ff';
    atlasCtx.beginPath(); atlasCtx.arc(bodyX, bodyY - 4, 2.5, 0, Math.PI*2); atlasCtx.fill();

    const headX = bodyX + headPanX;
    const headY = bodyY - 32;
    
    atlasCtx.fillStyle = '#333';
    atlasCtx.fillRect(bodyX - 5, headY + 14, 10, 8);
    
    atlasCtx.fillStyle = '#e0e0e0';
    atlasCtx.beginPath();
    atlasCtx.roundRect(headX - 15, headY - 15, 30, 30, 8);
    atlasCtx.fill();

    atlasCtx.fillStyle = '#0a0a0a';
    atlasCtx.beginPath();
    atlasCtx.roundRect(headX - 13, headY - 11, 26, 22, 5);
    atlasCtx.fill();

    const eyeY = headY - 4;
    const eyeWidth = 6;
    const eyeHeight = Math.max(0.1, 6 * eyeOpenness); 
    
    atlasCtx.fillStyle = isSpeaking ? '#ff1744' : '#00e676';
    atlasCtx.shadowBlur = 5;
    atlasCtx.shadowColor = atlasCtx.fillStyle;
    
    atlasCtx.beginPath();
    atlasCtx.ellipse(headX - 5 + headPanX*0.3, eyeY, eyeWidth/2, eyeHeight/2, 0, 0, Math.PI*2);
    atlasCtx.fill();
    atlasCtx.beginPath();
    atlasCtx.ellipse(headX + 5 + headPanX*0.3, eyeY, eyeWidth/2, eyeHeight/2, 0, 0, Math.PI*2);
    atlasCtx.fill();
    atlasCtx.shadowBlur = 0;

    const mouthY = headY + 5;
    if (isSpeaking) {
        const bars = 5;
        const barWidth = 2.5;
        const spacing = 4;
        const startX = headX - ((bars-1) * spacing) / 2;
        atlasCtx.fillStyle = '#ff1744';
        atlasCtx.shadowBlur = 8;
        atlasCtx.shadowColor = '#ff1744';
        for (let i = 0; i < bars; i++) {
            const h = 2 + Math.random() * 6;
            atlasCtx.beginPath();
            atlasCtx.roundRect(startX + (i * spacing) - barWidth/2, mouthY - h/2, barWidth, h, 1);
            atlasCtx.fill();
        }
    } else if (atlasUserInput && atlasUserInput.value.trim().length > 0) {
        const mouthWidth = 10;
        atlasCtx.fillStyle = '#00e676';
        atlasCtx.shadowBlur = 5;
        atlasCtx.shadowColor = '#00e676';
        atlasCtx.globalAlpha = 0.5 + Math.sin(atlasFrame * 0.2) * 0.5; 
        atlasCtx.beginPath();
        atlasCtx.roundRect(headX - mouthWidth/2, mouthY - 1, mouthWidth, 2, 1);
        atlasCtx.fill();
        atlasCtx.globalAlpha = 1.0;
    } else {
        atlasCtx.fillStyle = '#00e676';
        atlasCtx.globalAlpha = 0.3;
        atlasCtx.beginPath();
        atlasCtx.roundRect(headX - 2, mouthY - 1, 4, 2, 1);
        atlasCtx.fill();
        atlasCtx.globalAlpha = 1.0;
    }
    atlasCtx.shadowBlur = 0;

    drawLimb(bodyX - 14, bodyY + 25, 2, false, false);
    drawLimb(bodyX - 22, bodyY - 10, armSwing, false, true);

    // [감사#6] 뷰포트에 보일 때만 애니메이션 계속
    if (widgetContainer && widgetContainer.offsetParent !== null) {
        requestAnimationFrame(drawAtlas);
    } else {
        setTimeout(() => requestAnimationFrame(drawAtlas), 1000); // 숨겨진 상태면 1초 간격으로 체크
    }
}

window.toggleChat = function() {
    if(!atlasChatWindow) return;
    const isVisible = atlasChatWindow.style.display === 'flex';
    atlasChatWindow.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible && atlasUserInput) atlasUserInput.focus();
};

window.sendMessage = function() {
    if(!atlasUserInput) return;
    const text = atlasUserInput.value.trim();
    if (!text) return;
    appendAtlasMessage(text, 'user-msg');
    atlasUserInput.value = '';
    setTimeout(() => {
        robotSpeakResponse(text);
    }, 600);
};

window.robotSpeakResponse = async function(userText) {
    isSpeaking = true;

    const loadingId = 'loading-' + Date.now();
    appendAtlasMessage('💬 생각 중...', 'bot-msg', loadingId);

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });
        const data = await res.json();
        
        const loadingEl = document.getElementById(loadingId);
        if(loadingEl) loadingEl.remove();

        const responseText = data.reply || "통신 모듈 불안정. 잠시 후 삐빅- 다시 시도해주세요.";
        appendAtlasMessage(responseText, 'bot-msg');
        
        const speakTime = Math.min(responseText.length * 70, 5000); 
        setTimeout(() => { isSpeaking = false; }, speakTime);
    } catch (error) {
        console.error("API Error:", error);
        
        const loadingEl = document.getElementById(loadingId);
        if(loadingEl) loadingEl.remove();

        appendAtlasMessage("앗, 서버 통신 지연이 발생했습니다. 다시 말씀해주시겠어요?", 'bot-msg');
        isSpeaking = false;
    }
};

function appendAtlasMessage(text, className, id = null) {
    if(!atlasChatBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${className}`;
    msgDiv.innerText = text;
    if(id) msgDiv.id = id;
    atlasChatBox.appendChild(msgDiv);
    atlasChatBox.scrollTo({ top: atlasChatBox.scrollHeight, behavior: 'smooth' });
}

if(atlasSendBtn) atlasSendBtn.addEventListener('click', sendMessage);
if(atlasUserInput) atlasUserInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// --- 위젯(로봇) 드래그 및 클릭 기능 구현 ---
const widgetContainer = document.getElementById('chat-widget-container');
const robotContainer = document.getElementById('robot-canvas-container');

let isWidgetDragging = false;
let widgetDragOffsetX = 0;
let widgetDragOffsetY = 0;
let isWidgetMoved = false;

function startDrag(e) {
    if(e.type === 'mousedown') e.preventDefault();
    isWidgetDragging = true;
    isWidgetMoved = false;
    
    // 마우스/터치 좌표 가져오기
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const rect = widgetContainer.getBoundingClientRect();
    widgetDragOffsetX = clientX - rect.left;
    widgetDragOffsetY = clientY - rect.top;
    
    // जे약 해제 후 강제 Fixed 제어
    widgetContainer.style.bottom = 'auto';
    widgetContainer.style.right = 'auto';
    widgetContainer.style.margin = '0';
    widgetContainer.style.left = rect.left + 'px';
    widgetContainer.style.top = rect.top + 'px';
    
    robotContainer.style.cursor = 'grabbing';
}

function moveDrag(e) {
    if (!isWidgetDragging) return;
    isWidgetMoved = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    widgetContainer.style.left = (clientX - widgetDragOffsetX) + 'px';
    widgetContainer.style.top = (clientY - widgetDragOffsetY) + 'px';
}

function stopDrag() {
    if (isWidgetDragging) {
        isWidgetDragging = false;
        robotContainer.style.cursor = 'pointer';
        
        // 드래그가 아니라 단순 클릭(터치)이었을 경우 토글
        if (!isWidgetMoved) {
            toggleChat();
        }
    }
}

if(robotContainer && widgetContainer) {
    robotContainer.addEventListener('mousedown', startDrag, { passive: false });
    document.addEventListener('mousemove', moveDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);

    // 터치 이벤트 지원
    robotContainer.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

// 시작 시 캔버스 렌더링 시작
if(atlasCanvas) drawAtlas();

// ==================== PAYMENT OPTION HIGHLIGHT ====================
document.querySelectorAll('.pay-option').forEach(opt=>{
    opt.addEventListener('click',()=>{
        document.querySelectorAll('.pay-option').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
    });
});

// ==================== ADMIN PANE RESIZER ====================
const resizer = document.getElementById('dragResizer');
const adminPane = document.getElementById('adminPane');
let isResizing = false;

if(resizer && adminPane) {
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
        document.documentElement.style.userSelect = 'none'; // Prevent text selection
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        let newWidth = e.clientX;
        if (newWidth < 260) newWidth = 260; // min width
        if (newWidth > window.innerWidth * 0.6) newWidth = window.innerWidth * 0.6; // max 60% of screen
        adminPane.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.documentElement.style.userSelect = '';
        }
    });
}

// ==================== INIT ====================
renderStore();
