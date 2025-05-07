const axios = require("axios");
const fs = require("fs/promises")

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
    return response.data.USD.sell;
};

async function main() {
    const startTime = Date.now();

    const cars = await fetchCars();
    const marketData= await marketPriceData();
    const usdPrice = await fetchCurrency();

    const mapingCars = cars.map(car => {
        const match = marketData.find(market => {
            return market.brand === car.brand &&
                    market.model === car.model &&
                    market.year === car.year
        });
        const priceDiff = match ? car.price - match.average_price : 0;
        const mileageDiff = match ? car.mileage - match.average_mileage : 0;
        const priceUsd = usdPrice ? (car.price / usdPrice) : 0;

        return {
            ...car,
            price_diff_from_average: priceDiff,
            mileage_diff_from_average: mileageDiff,
            price_usd: Number(priceUsd)
        };
    });
    await fs.writeFile('cars_data.json', JSON.stringify(mapingCars, null , 2));

}