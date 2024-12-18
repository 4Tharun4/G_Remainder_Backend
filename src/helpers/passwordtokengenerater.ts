import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


interface PasswordPayload {
    password:string
};

const GenerateToken = (Password:PasswordPayload)=>{
    const payload = {Password}
    return jwt.sign(payload,JWT_SECRET_KEY);
}

export default GenerateToken;