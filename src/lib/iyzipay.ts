import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'ANAH-TARIN',
    secretKey: process.env.IYZICO_SECRET_KEY || 'GIZLI-ANAH-TARIN',
    uri: process.env.IYZICO_URI || 'https://api.iyzipay.com'
});

export default iyzipay;
