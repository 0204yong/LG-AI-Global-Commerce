const fs = require('fs');
const path = require('path');

const files = [
  'Dashboard.tsx',
  'AdminManage.tsx',
  'OrderDetail.tsx',
  'OrderManage.tsx',
  'ProductManage.tsx'
].map(f => path.join(__dirname, 'src', 'pages', f));

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace createdAt with created_at
    content = content.replace(/\.createdAt/g, '.created_at');
    content = content.replace(/createdAt:/g, 'created_at:');

    // Replace total with total_amount
    content = content.replace(/\.total\b/g, '.total_amount');
    content = content.replace(/total:/g, 'total_amount:');

    // Replace stock with stock_quantity
    content = content.replace(/\.stock\b/g, '.stock_quantity');
    content = content.replace(/stock:/g, 'stock_quantity:');

    // Replace storeId with website_id
    content = content.replace(/\.storeId\b/g, '.website_id');
    content = content.replace(/storeId:/g, 'website_id:');

    // Replace productCode with sku
    content = content.replace(/\.productCode\b/g, '.sku');
    content = content.replace(/productCode:/g, 'sku:');

    // Replace orderNumber with order_number
    content = content.replace(/\.orderNumber\b/g, '.order_number');
    content = content.replace(/orderNumber:/g, 'order_number:');

    // Replace items with order_items
    content = content.replace(/\.items\b/g, '.order_items');

    // Replace statusHistory with OrderStatusHistory
    content = content.replace(/\.statusHistory\b/g, '.OrderStatusHistory');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
