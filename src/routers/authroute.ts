import express from 'express'
import { register } from '../controllers/authentication'
export default (router:express.Router)=>{
    //@ts-ignore
    router.post('/auth/login',register)
};