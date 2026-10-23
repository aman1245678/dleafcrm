import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:aman@localhost:5432/whatsapp';

export const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.warn('⚠️ [PostgreSQL Pool] Client error:', err.message);
});

// Auto-initialize core CRM tables in the PostgreSQL database
export async function initPostgresTables() {
  try {
    const client = await pool.connect();
    console.log(`✅ [PostgreSQL] Connected to: ${connectionString.split('@')[1] || connectionString}`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        plan_key VARCHAR(50) DEFAULT 'trial',
        plan_status VARCHAR(50) DEFAULT 'active',
        agent_limit INT DEFAULT 2,
        contact_limit INT DEFAULT 500,
        deal_limit INT DEFAULT 50,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(255) UNIQUE NOT NULL,
        company_id VARCHAR(100) DEFAULT 'comp-dleaf',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        company VARCHAR(255),
        role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
        permissions TEXT DEFAULT '["all"]',
        phone VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        lead_id VARCHAR(100) UNIQUE,
        company_id VARCHAR(100) DEFAULT 'comp-dleaf',
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company VARCHAR(255),
        title VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(50),
        lead_source VARCHAR(100),
        lead_status VARCHAR(100),
        rating VARCHAR(50),
        industry VARCHAR(100),
        annual_revenue BIGINT,
        score INT DEFAULT 60,
        owner VARCHAR(100) DEFAULT 'Aman Kumar',
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        is_converted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        deal_id VARCHAR(100) UNIQUE,
        company_id VARCHAR(100) DEFAULT 'comp-dleaf',
        name VARCHAR(255),
        account_name VARCHAR(255),
        contact_name VARCHAR(255),
        amount BIGINT,
        stage VARCHAR(100),
        probability INT,
        expected_revenue BIGINT,
        closing_date VARCHAR(50),
        owner VARCHAR(100) DEFAULT 'Aman Kumar',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) DEFAULT 'comp-dleaf',
        sender VARCHAR(100),
        recipient VARCHAR(100),
        message TEXT,
        type VARCHAR(50) DEFAULT 'whatsapp',
        status VARCHAR(50) DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure default primary company exists
    await client.query(`
      INSERT INTO companies (company_id, name, email, phone, plan_key, plan_status, agent_limit, contact_limit, deal_limit)
      VALUES ('comp-dleaf', 'Dleaf Global HQ', 'aman.kumar@dleaf.com', '+91 98765 43210', 'enterprise', 'active', 50, 500000, 100000)
      ON CONFLICT (company_id) DO NOTHING;
    `);

    // Ensure default admin user exists
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', ['aman.kumar@dleaf.com']);
    if (adminCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO users (uid, email, password, name, company, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'usr-admin-default',
          'aman.kumar@dleaf.com',
          'aman',
          'Aman Kumar',
          'Dleaf Global',
          'admin',
          '+91 98765 43210'
        ]
      );
      console.log('👤 [PostgreSQL] Initialized default admin user: aman.kumar@dleaf.com');
    }

    client.release();
    console.log('🚀 [PostgreSQL] All CRM & WhatsApp tables initialized successfully in database!');
    return true;
  } catch (err: any) {
    console.warn(`⚠️ [PostgreSQL] Could not auto-migrate tables (database may be offline): ${err.message}`);
    return false;
  }
}
