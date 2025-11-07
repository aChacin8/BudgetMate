import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const generateJWT = (id: string) => {
    const token = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '15d'
    });
    return token; 
}