## Intro

This project demonstrate the usage of Rapyd payment infrastructure for Evermore marketplace.

Evermore should be accessible for all customers, without any prior knowledge or understanding about blockchain or NFT. This is where Rapyd comes into place as a payment infrastructure allowing us to abstract the blockchain layer for our customers.

## Installation

This project is based on [Node.js](https://nodejs.org/en/) available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

Configure your environment:
copy/paste .env.sample into .env file and copy past your Rapyd SANDBOX keys from your Rapyd account:
```
RAPYD_ACCESS_KEY=<SANDBOX ACCESS KEY>
RAPYD_SECRET_KEY=<SANDBOC SECRET KEY>
```

Start the server:

```console
npm start
```

View the website at: http://localhost:3000


## Demo

- To test this APIs, go to http://localhost:3000 and create a company, a user and a product using the test forms.
- Then buy a product using buyerId 0 et productId 0
- Finally validate your payment (paymentId is 0)
