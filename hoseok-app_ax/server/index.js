const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const agentRoutes = require('./routes/agentRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/agent', agentRoutes);

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

BigInt.prototype.toJSON = function() { return this.toString() };

// === Initial Seeder ===
async function seedData() {
  try {
    const storeCount = await prisma.website.count();
    if (storeCount === 0) {
      await prisma.website.createMany({
        data: [
          { website_id: 'KR', country: 'Korea', subsidiary_code: 'KRW', locale_code: 'ko-KR' },
          { website_id: 'US', country: 'USA', subsidiary_code: 'USD', locale_code: 'en-US' }
        ]
      });
      console.log('Seeded default websites (KR, US)');
    }

    const adminCount = await prisma.admin_users.count();
    if (adminCount === 0) {
      await prisma.admin_users.create({
        data: {
          username: 'admin',
          password: 'admin123',
          role: 'SUPER_ADMIN',
          website: 'KR'
        }
      });
      console.log('Seeded default admin user (admin / admin123)');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await seedData();
  console.log(`Server is running on http://localhost:${PORT}`);
});
