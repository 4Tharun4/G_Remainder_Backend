import express from 'express'
import authroute from './authroute';
const  router = express.Router();
export default ():express.Router =>{
    authroute(router)
    return router;
}