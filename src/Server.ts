import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import compression from 'compression'
import bodyParser from 'body-parser'
import http from 'http'
import mongoose from 'mongoose'
import routers from './routers/routers'
import updateUserInfo from './routers/Schedule'
import corn from 'node-cron'
import dotenv from 'dotenv'
dotenv.config();
const app = express();

app.use(cors({
    credentials:true
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieparser());
const  server = http.createServer(app);




server.listen(8080,()=>{
    console.log("server is running in port http://localhost:8080/");
    
});


corn.schedule('0 * * * *', async () => {
    console.log('Running a task every minute');
    updateUserInfo();
  });
 

//db connect
const MONGODB_URL = process.env.MONGODB_URL; 
mongoose.connect(MONGODB_URL); 
mongoose.Promise = Promise; 
mongoose.connection.on("error",(error:Error)=>{
    console.log(error);
    
})
app.use("/api/V1",routers())