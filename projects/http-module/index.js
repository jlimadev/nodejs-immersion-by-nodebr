const http = require('http');
const PORT = 8000;

http
  .createServer((request, response) => {
    response.end('Hello NodeJS!');
  })
  .listen(PORT, () =>
    console.log(`The server is running on localhost:${PORT}`),
  );
