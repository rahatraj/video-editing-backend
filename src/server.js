import dotenv from 'dotenv'
import app from './app.js'
dotenv.config()

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`App is running on the port ${PORT}`)
})


