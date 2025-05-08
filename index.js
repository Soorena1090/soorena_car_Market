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

function analysis(cars) {
    const brandModel = {};
    cars.forEach(car => {
        const key = `${car.brand} ${car.model}`;
        if (brandModel[key]) {
            brandModel[key]++;
        }else {
            brandModel[key] = 1;
        }
    });
    let mostCommon = '';
    let maxCount = 0;
    for (const key in brandModel) {
        if (brandModel[key] > maxCount) {
            mostCommon = key;
            maxCount = brandModel[key];
        }
    }
    console.log("Q1: Most common brand & model:", mostCommon, "-", maxCount, "cars")
    //--------------------------------Q2
    const top3Expensive = [...cars].sort((a, b) => b.price - a.price).slice(0,3);
    top3Expensive.forEach(car => {
        console.log(`${car.brand} ${car.model}, ${car.price} IRR`);
    });

    //--------------------------------Q3
    const carByUsd = [...cars].sort((a,b) => a.price_usd - b.price_usd);
    const min = carByUsd[0].price_usd;
    const max = carByUsd[carByUsd.length - 1].price_usd;
    console.log("Q3: USD price difference between most and least expensive cars:", (max - min), "USD");
    //---------------------------------Q4
    const colorCounts = {};
    cars.forEach(car => {
        if (colorCounts[car.color]) {
        colorCounts[car.color]++;
        } else {
        colorCounts[car.color] = 1;
        }
    });
    for (const color in colorCounts) {
        console.log(` - ${color}: ${colorCounts[color]}`);
    };

}
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
    analysis(mapingCars);

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000);
    console.log(`${timeTaken}`);
}
main();