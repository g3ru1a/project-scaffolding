import express from 'express';
import {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

//Load .env data
dotenv.config();

const app = express();
const PORT: string = process.env.PORT || (3000).toString();

//Middleware
app.use('/public', express.static(path.join(__dirname,'../public')));
app.use(express.json());
app.use(cors());

//Routes
app.get('/', 
    (req: Request, res: Response) => {
        res.send('Hello World!');
    }
);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));