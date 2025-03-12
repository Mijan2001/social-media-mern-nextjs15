const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to DB
mongoose
    .connect(process.env.DB)
    .then(() => console.log('Database connection successful!'))
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port http://localhost:${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
