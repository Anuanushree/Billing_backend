require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const SECRET_CODE = process.env.SECRET_CODE;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

module.exports = {
    MONGO_URL,
    PORT,
    SECRET_CODE,
    EMAIL,
    PASSWORD,
}