require('dotenv').config();
const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, '../server/database/data.db');
const db = createClient({ url: `file:${dbPath}` });

async function cleanup() {
  console.log('--- Cleaning up duplicate news entries ---\n');

  // Keep these IDs (the best representative of each group)
  // Delete all other IDs listed
  const groups = [
    { keep: 156, delete: [45],             label: 'DIY Drone' },
    { keep: 172, delete: [16, 52, 155, 158, 159, 164], label: 'AI Feature' },
    { keep: 106, delete: [12, 51, 176],     label: 'Bilingual' },
    { keep: 181, delete: [120, 123, 126, 152], label: 'DB Optimize' },
    { keep: 175, delete: [107, 171],        label: 'UI/Visual' },
    { keep: 117, delete: [110],             label: 'Portable Welder' },
  ];

  const allDeleteIds = groups.flatMap(g => g.delete);
  const placeholders = allDeleteIds.map(() => '?').join(',');

  // 1. Backup entries before deleting
  const backup = await db.execute({
    sql: `SELECT id, title, body, postedAt, titleVi, bodyVi FROM updates WHERE id IN (${placeholders}) ORDER BY id`,
    args: allDeleteIds
  });

  // 2. Delete
  const deleteResult = await db.execute({
    sql: `DELETE FROM updates WHERE id IN (${placeholders})`,
    args: allDeleteIds
  });

  console.log(`Deleted ${deleteResult.rowsAffected} entries\n`);

  // 3. Print summary per group
  for (const g of groups) {
    const deleted = backup.rows.filter(r => g.delete.includes(r.id));
    const kept = (await db.execute({
      sql: 'SELECT title FROM updates WHERE id = ?',
      args: [g.keep]
    })).rows[0];
    console.log(`[${g.label}]`);
    console.log(`  Kept ID ${g.keep}: "${kept ? kept.title : '(not found)'}"`);
    for (const d of deleted) {
      console.log(`  Deleted ID ${d.id}: "${d.title}"`);
    }
    console.log();
  }

  // 4. Save backup to JSON file
  const fs = require('fs');
  const backupPath = path.join(__dirname, 'backup-deleted-updates.json');
  fs.writeFileSync(backupPath, JSON.stringify(backup.rows, null, 2));
  console.log(`Backup saved to: ${backupPath}`);

  // 5. Verify remaining count
  const remaining = await db.execute('SELECT COUNT(*) as cnt FROM updates');
  console.log(`\nRemaining entries: ${remaining.rows[0].cnt}`);
  console.log('--- Done ---');
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err.message);
  process.exit(1);
});
