const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('express test');
});

app.listen(3000, () => {
  console.log('server is running');
});
