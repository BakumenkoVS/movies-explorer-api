const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});