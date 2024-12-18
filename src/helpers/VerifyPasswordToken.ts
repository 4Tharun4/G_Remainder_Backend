import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

interface PasswordPayload {
    Password: string;
}

const verifyToken = (Password: string): string | null => {
   // console.log("Token:", Password);

    try {
        const decoded = jwt.verify(Password, JWT_SECRET_KEY) as PasswordPayload;
        //console.log("Decoded:", decoded);

        if (decoded && typeof decoded.Password === 'string') {
            return decoded.Password;
        } else {
           // console.error('Decoded token does not contain a valid password.');
            return null;
        }
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export default verifyToken;
