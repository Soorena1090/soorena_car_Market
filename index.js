const axios = require('axios');

axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/cars.json')
.then(response => {
    console.log(response);
})
.catch (error => {
    console.error(error);
});


async function marketPriceData() {
    const response = await axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/market_prices.json')
    console.log(response);
};
marketPriceData()

axios.get('https://baha24.com/api/v1/price')
.then(response => {
    console.log(response);
})
.catch(error => {
    console.error(error);
});