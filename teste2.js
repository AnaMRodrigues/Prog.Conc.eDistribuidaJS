const fs = require('fs');
const path = require('path');
const coolPath = path.join(__dirname, 'empresas_bahia.csv');
const stream = fs.createReadStream(coolPath);
// Create readable stream
//var readableStream = fs.createReadStream('empresas_bahia.csv');

// Pipe it to out stdout
stream.pipe(process.stdout);