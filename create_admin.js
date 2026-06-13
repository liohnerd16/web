const bcrypt = require('bcryptjs');
const db = require('./server/database/db');

async function createAdmin() {
  const email = 'admin@scivid.com';
  const password = 'SaoVang1622!';
  const username = 'Admin';

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute({
      sql: 'INSERT OR REPLACE INTO users (email, password, username, role, createdAt) VALUES (?, ?, ?, ?, ?)',
      args: [email, hashedPassword, username, 'admin', new Date().toISOString()]
    });

    console.log('Admin account created successfully:');
    console.log('Email: ' + email);
    console.log('Password: ' + password);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    process.exit();
  }
}

createAdmin();
