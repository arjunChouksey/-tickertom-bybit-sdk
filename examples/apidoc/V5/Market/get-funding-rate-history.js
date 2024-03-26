const { RestClientV5 } = require('bybit-api');

const client = new RestClientV5({
  testnet: true,
});

client
  .getFundingRateHistory({
    category: 'linear',
    symbol: 'ETHPERP',
    limit: 1,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
