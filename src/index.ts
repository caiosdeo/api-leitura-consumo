require('dotenv').config();

import express from 'express';

import router from './routes';
import connectToDatabase from './db';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', router());

connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
    });
