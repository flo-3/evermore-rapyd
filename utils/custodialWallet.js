async function createCustodialWallet(entity) {
  try {
    // Create a custodial wallet
    return entity;
  } catch (error) {
    console.error('Error completing request', error);
  }
}

async function excecuteTransaction(payment, buyer, seller) {
  try {
    // Excecute the transaction on the blockchain
    return true;
  } catch (error) {
    console.error('Error completing request', error);
  }
}

exports.createCustodialWallet = createCustodialWallet;
exports.excecuteTransaction = excecuteTransaction;