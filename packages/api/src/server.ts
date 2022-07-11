import { createServer } from 'http';

import app from './app';

const PORT = 3030;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

