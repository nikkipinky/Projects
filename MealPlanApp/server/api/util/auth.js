import jwt from 'jsonwebtoken';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

// run this command line: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET;
const KEYLEN = 32;

const hash = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString('hex');

        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            const derivedHex = derivedKey.toString('hex');
            console.log(`${salt}:${derivedHex}`);

            resolve(`${salt}:${derivedHex}`);
        });
    });
};

const compare = async (password, dbPassword) => {
    return new Promise((resolve, reject) => {
        const [salt, hash] = dbPassword.split(':');

        const hashBuffer = Buffer.from(hash, 'hex');
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            const isEqual = timingSafeEqual(hashBuffer, derivedKey);
            resolve(isEqual);
        });
    });
};

const signToken = (username, _id) => {
    const user = { username, user_id: _id };
    return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { hash, compare, signToken, verifyToken };
