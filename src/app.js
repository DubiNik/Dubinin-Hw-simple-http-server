
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const query = Object.fromEntries(url.searchParams);

  res.setHeader('Content-Type', 'text/html');

  if (pathname === '/calc') {
    const { operation, a, b } = query;
    const numA = Number(a);
    const numB = Number(b);

    let result;

    switch (operation) {
      case 'add':
        result = numA + numB;
        break;
      case 'sub':
        result = numA - numB;
        break;
      case 'mul':
        result = numA * numB;
        break;
      case 'div':
        result = numA / numB;
        break;
      default:
        res.statusCode = 400;
        result = 'Operation unknown';
    }

    res.end(String(result));
    return;
  }

  if (pathname === '/fs') {
    const { operation, filename, text } = query;
    const filePath = path.join(process.cwd(), filename || '');

    if (operation === 'create') {
      fs.writeFile(filePath, text || '', (error) => {
        if (error) {
          res.statusCode = 400;
          res.end('Operation unknown');
          return;
        }

        res.statusCode = 201;
        res.end(`${filename} was created`);
      });

      return;
    }

    if (operation === 'read') {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          res.statusCode = 400;
          res.end('File not found');
          return;
        }

        res.statusCode = 201;
        res.end(data);
      });

      return;
    }

    res.statusCode = 400;
    res.end('Operation unknown');
    return;
  }

  res.statusCode = 400;
  res.end('Operation unknown');
});

module.exports = server;
