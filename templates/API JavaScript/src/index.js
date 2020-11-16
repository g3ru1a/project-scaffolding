import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {dirname} from 'path';
import path from 'path';
import {fileURLToPath} from 'url';

//Load .env data
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use('/public', express.static(path.join(__dirname,'../public')));
app.use(express.json());
app.use(cors());

//Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));