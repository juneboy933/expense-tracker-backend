const fs = require('fs');
const path = require('path');

const db_path = path.join(__dirname, 'data.json');

// Read File
const readDB = () => {
    const data = fs.readFileSync(db_path, 'utf-8');
    return JSON.parse(data);
};

// Write to file
const writeDB = (data) => {
    fs.writeFileSync(db_path, JSON.stringify(data, null, 2));
    return;
};

module.exports = { readDB, writeDB};