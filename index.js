// code away!
const express = require('express');

const userRouter = require('./users/userRouter.js');

const postRouter = require('./posts/postRouter.js');

const server = express();

server.use(express.json());

server.use(logger);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

// requests to routes that begin with /api/hubs
server.use('/api/users', userRouter);

server.use('/api/posts', postRouter);

function logger(req, res, next) {
    const { method, originalUrl } = req;
    console.log(`[${new Date().toISOString()}] ${method} to ${originalUrl}`);
    next();
}
const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log('\n*** Server Running on http://localhost:8000 ***\n');
});
