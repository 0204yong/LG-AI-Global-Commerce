let products = [
    // --- TVs (10) ---
    { id:'tv1', cat:'TV', name:'LG SIGNATURE OLED M4 97"', model:'OLED97M4', price:24999, img:'assets/images/products/oled_tv_real.png', desc:'The world\'s first 4K 144Hz wireless OLED TV. Stunning design with zero cable clutter.' },
    { id:'tv2', cat:'TV', name:'LG OLED evo G4 83"', model:'OLED83G4', price:6499, img:'assets/images/products/oled_tv_real.png', desc:'Brightness Booster Max for ultimate HDR performance. Flush wall mount design.' },
    { id:'tv3', cat:'TV', name:'LG OLED evo C4 77"', model:'OLED77C4', price:3499, img:'assets/images/products/tv1.png', desc:'Incredible gaming performance with 144Hz VRR and pristine color accuracy.' },
    { id:'tv4', cat:'TV', name:'LG QNED90 86"', model:'86QNED90', price:3299, img:'assets/images/products/tv2.png', desc:'Quantum Dot meets NanoCell. MiniLED for brilliant colors and deep blacks.' },
    { id:'tv5', cat:'TV', name:'LG OLED B4 65"', model:'OLED65B4', price:1699, img:'assets/images/products/tv1.png', desc:'Your gateway to OLED. Perfect blacks and infinite contrast.' },
    { id:'tv6', cat:'TV', name:'LG StandbyME Go', model:'27LX5', price:1199, img:'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600', desc:'Portable 27" touch screen in a briefcase design. Entertainment anywhere.' },
    { id:'tv7', cat:'TV', name:'LG QNED85 75"', model:'75QNED85', price:1799, img:'assets/images/products/tv1.png', desc:'Advanced LCD tech for vibrant, accurate colors in bright rooms.' },
    { id:'tv8', cat:'TV', name:'LG OLED evo M3 77"', model:'OLED77M3', price:4999, img:'assets/images/products/tv2.png', desc:'Wireless 4K 120Hz Transmission. A clean space, a stunning view.' },
    { id:'tv9', cat:'TV', name:'LG UHD 86" UR8000', model:'86UR8000', price:1499, img:'assets/images/products/tv1.png', desc:'Big screen for everyday entertainment. Real 4K picture quality.' },
    { id:'tv10', cat:'TV', name:'LG Objet Posé 55"', model:'55LX1', price:1999, img:'assets/images/products/tv2.png', desc:'A TV that doubles as a piece of furniture. Cable management built into the legs.' },

    // --- Refrigerators (10) ---
    { id:'ref1', cat:'Appliance', name:'LG InstaView Door-in-Door', model:'GSXV90MCDE', price:2499, img:'assets/images/products/instaview_real.png', desc:'Knock twice to see inside. Keep cold air in and access favorites faster.' },
    { id:'ref2', cat:'Appliance', name:'LG SIGNATURE Refrigerator', model:'LSR100', price:7999, img:'assets/images/products/instaview_real.png', desc:'Auto Open Door and Auto Open Drawer. Premium textured steel finish.' },
    { id:'ref3', cat:'Appliance', name:'LG Slim French Door', model:'GML844PZKV', price:1899, img:'assets/images/products/fridge.png', desc:'Fits in narrow spaces without compromising on advanced cooling features.' },
    { id:'ref4', cat:'Appliance', name:'LG Bottom Freezer', model:'GBB92MCB1P', price:1199, img:'assets/images/products/fridge.png', desc:'DoorCooling+ and LINEARCooling for maximum freshness for longer.' },
    { id:'ref5', cat:'Appliance', name:'LG Multi-Door Fridge', model:'GMJ916PZHV', price:2299, img:'assets/images/products/fridge.png', desc:'Spacious layout with a custom chill drawer for optimal temperature control.' },
    { id:'ref6', cat:'Appliance', name:'LG Objet Collection InstaView', model:'CB-Objet', price:2999, img:'assets/images/products/fridge.png', desc:'Customizable color panels to match your kitchen interior seamlessly.' },
    { id:'ref7', cat:'Appliance', name:'LG Side-by-Side Craft Ice', model:'GSJV91BSAE', price:2199, img:'assets/images/products/fridge.png', desc:'Dual ice maker producing slow-melting spherical Craft Ice for premium drinks.' },
    { id:'ref8', cat:'Appliance', name:'LG Tall Larder Fridge', model:'GL5241PZJZ1', price:899, img:'assets/images/products/fridge.png', desc:'Maximized fresh food capacity. Clean, minimalist exterior.' },
    { id:'ref9', cat:'Appliance', name:'LG Tall Freezer', model:'GF5237PZJZ1', price:899, img:'assets/images/products/fridge.png', desc:'Frost free vertical freezer to pair perfectly with your larder fridge.' },
    { id:'ref10', cat:'Appliance', name:'LG Compact Top Freezer', model:'GTF916PZ', price:699, img:'assets/images/products/fridge.png', desc:'Classic layout with modern cooling technology. Perfect for smaller homes.' },

    // --- Washing Machines (10) ---
    { id:'wm1', cat:'Appliance', name:'LG WashTower™', model:'WTH870W', price:2799, img:'assets/images/products/washtower_real.png', desc:'Single unit washer-dryer combo with centralized control panel. Saves space.' },
    { id:'wm2', cat:'Appliance', name:'LG SIGNATURE Washing Machine', model:'LWT100', price:2999, img:'assets/images/products/washer.png', desc:'TwinWash system. Wash two loads at once in absolute silence.' },
    { id:'wm3', cat:'Appliance', name:'LG AI DD™ 12kg Washer', model:'F4V1112WTS', price:1099, img:'assets/images/products/washer.png', desc:'AI detects fabric weight and softness to choose optimal wash motions.' },
    { id:'wm4', cat:'Appliance', name:'LG TurboWash™ 360 10.5kg', model:'F4V910WTS', price:949, img:'assets/images/products/washer.png', desc:'Fastest, cleanest wash in just 39 minutes with 3D multi-nozzle spray.' },
    { id:'wm5', cat:'Appliance', name:'LG Steam™ Washer 9kg', model:'F4V709WTS', price:799, img:'assets/images/products/washer.png', desc:'Allergy Care cycle effectively eliminates 99.9% of allergens using steam.' },
    { id:'wm6', cat:'Appliance', name:'LG Heat Pump Tumble Dryer 9kg', model:'FDV909W', price:1199, img:'assets/images/products/washer.png', desc:'Dual Inverter Heat Pump for ultimate energy efficiency and fabric care.' },
    { id:'wm7', cat:'Appliance', name:'LG Slim Washer 7kg', model:'F2V507WS', price:599, img:'assets/images/products/washer.png', desc:'Slimmer depth to fit in tight spaces without losing AI Direct Drive benefits.' },
    { id:'wm8', cat:'Appliance', name:'LG Washer/Dryer 10/6kg', model:'FWV917WTS', price:1299, img:'assets/images/products/washer.png', desc:'All-in-one laundry solution. AI DD ensures gentle care during washing and drying.' },
    { id:'wm9', cat:'Appliance', name:'LG Styler (Steam Clothing Care)', model:'S3BF', price:1999, img:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600', desc:'Refresh, sanitize, and gently dry garments that can\'t be washed traditionally.' },
    { id:'wm10', cat:'Appliance', name:'LG Top Load Washer 15kg', model:'T1509VS', price:849, img:'assets/images/products/washer.png', desc:'TurboDrum tech removes tough stains while being gentle on the fabric.' },

    // --- Audio (5) ---
    { id:'au1', cat:'AV', name:'LG Soundbar S95TR', model:'S95TR', price:1499, img:'assets/images/products/soundbar.png', desc:'9.1.5 ch, 810W. Triple up-firing channels for immaculate immersive audio.' },
    { id:'au2', cat:'AV', name:'LG XBOOM 360', model:'XO3Q', price:299, img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600', desc:'Omnidirectional sound with mood lighting. The perfect lantern-style party speaker.' },
    { id:'au3', cat:'AV', name:'LG TONE Free T90Q', model:'TONE-T90Q', price:229, img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600', desc:'Dolby Atmos wireless earbuds with head tracking and UVnano charging case.' },
    { id:'au4', cat:'AV', name:'LG Soundbar SE6S', model:'SE6S', price:499, img:'assets/images/products/soundbar.png', desc:'Compact, all-in-one soundbar delivering rich bass without an external subwoofer.' },
    { id:'au5', cat:'AV', name:'LG XBOOM Go XG9Q', model:'XG9Q', price:449, img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600', desc:'Rugged, portable Bluetooth speaker with massive sound, deep bass, and stage lighting.' },

    // --- PC (5) ---
    { id:'pc1', cat:'Computing', name:'LG gram Pro 16"', model:'16Z90SP', price:1999, img:'assets/images/products/laptop.png', desc:'Exceptionally light 16-inch laptop. Intel Core Ultra and RTX 3050 graphics.' },
    { id:'pc2', cat:'Computing', name:'LG gram 17"', model:'17Z90S', price:1799, img:'assets/images/products/laptop.png', desc:'Maximised productivity with a massive 17-inch display, yet weighs only 1.35kg.' },
    { id:'pc3', cat:'Computing', name:'LG gram 2-in-1 14"', model:'14T90S', price:1599, img:'assets/images/products/laptop.png', desc:'Flexible 360-degree hinge, touch screen, and integrated stylus pen for creators.' },
    { id:'pc4', cat:'Computing', name:'LG gram Style 16"', model:'16Z90RS', price:2199, img:'assets/images/products/laptop.png', desc:'Stunning iridescent glass design and invisible haptic touchpad. OLED display.' },
    { id:'pc5', cat:'Computing', name:'LG gram SuperSlim 15"', model:'15Z90ST', price:1699, img:'assets/images/products/laptop.png', desc:'The thinnest LG gram ever. OLED screen and incredibly portable at 0.43 inches thick.' },

    // --- Monitor (5) ---
    { id:'mo1', cat:'Computing', name:'LG UltraGear OLED 45"', model:'45GR95QE', price:1699, img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600', desc:'45-inch 800R curved OLED gaming monitor. 240Hz, 0.03ms response time.' },
    { id:'mo2', cat:'Computing', name:'LG DualUp 28"', model:'28MQ780', price:699, img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600', desc:'16:18 aspect ratio (Dual 21.5" displays stacked). Ergo stand for ultimate flexibility.' },
    { id:'mo3', cat:'Computing', name:'LG UltraFine 5K 27"', model:'27MD5KL', price:1299, img:'https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=600', desc:'Perfect companion for Mac. 5K resolution (5120 x 2880) for crystal clear detail.' },
    { id:'mo4', cat:'Computing', name:'LG Smart Monitor 32"', model:'32SQ780S', price:499, img:'https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=600', desc:'Work without a PC. Built-in webOS for streaming, browsing, and cloud work.' },
    { id:'mo5', cat:'Computing', name:'LG UltraWide 34" Curved', model:'34WQ75C', price:599, img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600', desc:'21:9 WQHD resolution. Perfect for multitasking and video editing.' },

    // --- Bundles (3) ---
    {
        id:'bun1', cat:'Appliance', name:'Ultimate LG Kitchen Upgrade', price:4499, discount: 15,
        bundleItems: [{name:'InstaView Door-in-Door', img:'assets/images/products/instaview_real.png'},
                      {name:'QuadWash Dishwasher', img:'assets/images/products/fridge.png'}],
        desc:'Upgrade your kitchen with LG\'s top-tier smart refrigeration and whisper-quiet dishwashing.'
    },
    {
        id:'bun2', cat:'TV', name:'Home Cinema Experience', price:8500, discount: 12,
        bundleItems: [{name:'OLED evo G4 83"', img:'assets/images/products/oled_tv_real.png'},
                      {name:'Soundbar S95TR', img:'assets/images/products/soundbar.png'}],
        desc:'The pinnacle of visual and audio achievement. Mount the G4 flush to your wall and immerse in Dolby Atmos.'
    },
    {
        id:'bun3', cat:'Computing', name:'Creator\'s Home Office', price:2799, discount: 10,
        bundleItems: [{name:'LG gram Pro 16"', img:'assets/images/products/laptop.png'},
                      {name:'LG DualUp 28" Monitor', img:'assets/images/products/laptop.png'}],
        desc:'Supercharge your productivity with the uncompromised performance of the gram Pro and the 16:18 DualUp screen.'
    }
];
