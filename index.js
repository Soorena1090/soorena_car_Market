const axios = require('axios');

async function fetchCars() {
    const response = await axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/cars.json')
    return response.data;
};


async function marketPriceData() {
    const response = await axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/market_prices.json')
    return response.data;
};

async function fetchCurrency() {
    const response = await axios.get('https://baha24.com/api/v1/price')
    return response.data.USD.Sell;
};
