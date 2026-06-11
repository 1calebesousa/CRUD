const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
    const dir = __dirname;
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.sql') && f.match(/^\d+/))
        .sort();

    for (const file of files) {
        const filePath = path.join(dir, file);
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(filePath, 'utf8').toString();
        if (!sql.trim()) {
            console.log(`Skipping empty file: ${file}`);
            continue;
        }

        await new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    console.error(`Error applying ${file}:`, err.message || err);
                    return reject(err);
                }
                console.log(`Applied ${file}`);
                resolve(results);
            });
        });
    }

    console.log('All migrations applied successfully.');
    db.end();
}

run().catch(err => {
    console.error('Migration process failed:', err.message || err);
    try { db.end(); } catch (e) {}
    process.exit(1);
});
