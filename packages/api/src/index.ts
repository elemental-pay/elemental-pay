import express from 'express';
import { createServer } from 'http';

const PORT = 3000;

const app = express();
app.get("/test", (req, res) => {
  res.status(200).send("Hello, World! API is running...");
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

