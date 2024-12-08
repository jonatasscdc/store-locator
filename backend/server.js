const app = require('./src/app');
const { port } = require('./src/config/env');

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
