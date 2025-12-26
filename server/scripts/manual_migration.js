const { sequelize } = require('../models');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        console.log('Attempting to add dropoff_address column...');
        // Add column if not exists
        await sequelize.query(`
      ALTER TABLE "orders" 
      ADD COLUMN IF NOT EXISTS "dropoff_address" VARCHAR(255);
    `);

        console.log('✅ Migration successful: dropoff_address column checked/added.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await sequelize.close();
    }
}

migrate();
