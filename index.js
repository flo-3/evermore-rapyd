const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const path = require('path');
const port = process.env.PORT || 3000


app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const evermoreWalletId = "ewallet_97c6a085a0239c7c8a6792f70247e7a8";

const createPersonalWallet = require('./utils/rapydWallet').createPersonalWallet;
const createCompanyWallet = require('./utils/rapydWallet').createCompanyWallet;
const uploadProductMetadata = require('./utils/productUpload').uploadProductMetadata;
const createCustodialWallet = require('./utils/custodialWallet').createCustodialWallet;
const buyProduct = require('./utils/rapydPayment').buyProduct;
const releasePayment = require('./utils/rapydPayment').releasePayment;
const excecuteTransaction = require('./utils/custodialWallet').excecuteTransaction;


// Will be replaced by a database
let users = [];
let companies = [];
let products = [];
let escrowPayments = [];


// Test frontend
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/new-user', function(req, res) {
  res.sendFile(path.join(__dirname, './test-forms/new-user.html'));
});
app.get('/new-company', function(req, res) {
  res.sendFile(path.join(__dirname, './test-forms/new-company.html'));
});
app.get('/new-product', function(req, res) {
  res.sendFile(path.join(__dirname, './test-forms/new-product.html'));
});
app.get('/buy-product', function(req, res) {
  res.sendFile(path.join(__dirname, './test-forms/buy-product.html'));
});
app.get('/validate-payment', function(req, res) {
  res.sendFile(path.join(__dirname, './test-forms/validate-payment.html'));
});


// Create a new user
app.post('/user', async function(req, res) {
  const user = req.body;
  console.log(user);
  completeUser = await createCustodialWallet(user);
  completeUser = await createPersonalWallet(completeUser, users.length + 265);
  if (completeUser) {
    users.push(completeUser);
    res.send(`User is added to the database with ID ${users.length-1} and Rapyd wallet ID ${completeUser.ewallet_reference_id}`);
  }
  else {
    res.send("Error while creating user");
  }
});

// Retrieve existing users
app.get('/users', (req, res) => {
  res.json(users);
});

// Create a new company
app.post('/company', async function(req, res) {
  const company = req.body;
  console.log(company);
  completeCompany = await createCustodialWallet(company);
  completeCompany = await createCompanyWallet(completeCompany, companies.length +40);
  if (completeCompany) {
    companies.push(completeCompany);
    res.send(`Company is added to the database with ID ${companies.length-1} and Rapyd wallet ID ${completeCompany.ewallet_reference_id}`);
  }
  else {
    res.send("Error while creating company");
  }
});

// Retrieve existing companies
app.get('/companies', (req, res) => {
  res.json(companies);
});

// Create a new product
app.post('/product', async function(req, res) {
  const product = req.body;
  console.log(product);
  completeProduct = await uploadProductMetadata(product);
  if (completeProduct) {
    completeProduct.new = true;
    products.push(completeProduct);
    res.send(`Product is added to the database with ID ${products.length-1}`);
  } else {
    res.send("Error while creating product");
  }
});

// Retrieve existing products
app.get('/products', (req, res) => {
  res.json(products);
});


// Buy a product
app.post('/buy', async function(req, res) {
  const productId = req.body.productId;
  const buyerId = req.body.buyerId;
  let product = products[productId];
  let seller = product.new ? companies[product.ownerId] : users[product.ownerId];
  let buyer = users[buyerId];
  console.log(req.body);
  console.log('buyer', buyer)
  console.log('seller', seller)
  console.log('product', product)
  let payment = await buyProduct(product, seller, evermoreWalletId);
  if (payment) {
    payment.productId = productId;
    payment.buyerId = buyerId;
    escrowPayments.push(payment);
    res.send(`Payment successfully saved with ID ${escrowPayments.length-1}. Wating for your validation that the product has been delivered`);
  } else {
    res.send("Error while saving the Payment");
  }
});


// Retrieve all Escrow transaction
app.get('/pending-payments', (req, res) => {
  res.json(escrowPayments);
});

// validate product reception
app.post('/validate-payment', async function(req, res) {
  // TODO: add sender validatation as only buyer can validate a payment
  const paymentId = req.body.paymentId;
  const payment = escrowPayments[paymentId];
  let transaction = await releasePayment(payment);
  if (transaction) {
    escrowPayments.slice(paymentId, 1);
    products[payment.productId].ownerId = transaction.buyerId;
    res.send('Transaction successfully validated');
  } else {
    res.send("Error while saving the transaction");
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
