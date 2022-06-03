const fs = require('fs');
const path = require('path');
const coolPath = path.join(__dirname, 'empresas_bahia.csv');
const stream = fs.createReadStream(coolPath);
stream.pipe(process.stdout);