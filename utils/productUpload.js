async function uploadProductMetadata(product) {
  try {
    // Upload product metadata on IPFS (decentralized storage)
    return product;
  } catch (error) {
    console.error('Error completing request', error);
  }
}

exports.uploadProductMetadata = uploadProductMetadata;