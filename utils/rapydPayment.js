const makeRequest = require('./rapydConnect').makeRequest;
async function buyProduct(product, seller, evermoreWalletId) {
  try {
    const body =
    {
        "amount": product.price,
        "currency": "USD",
        "description": "payment by card",
        "capture": true,
        "payment_method": {
            "type": "at_visa_card",
            "fields": {
                "name": "John Doe",
                "number": "5188340000000060",
                "expiration_month": "04",
                "expiration_year": "23",
                "cvv": "150"
            }
        },
        "payment_method_options": {
            "3d_required": false
        },
        "payment_options": {},
        "escrow": true,
        "ewallets": [
            {
                "ewallet": seller.id,
                "percentage": product.new === true ? 98 : 95
            },
            {
              "ewallet": evermoreWalletId,
              "percentage": product.new === true ? 2 : 5
            }
        ],
        "metadata": {
            "merchant_defined": "created"
        }
    };
    const result = await makeRequest('POST', '/v1/payments', body);
    console.log(result);
    return result.body.data;
  } catch (error) {
    console.error('Error completing request', error);
  }
}

async function releasePayment(payment) {
  try {
    const url = `/v1/payments/${payment.escrow.payment}/escrows/${payment.escrow.id}/escrow_releases`
    const result = await makeRequest('POST', url);
    console.log(result);
    return result.body.data;
  } catch (error) {
    console.error('Error completing request', error);
  }
}

exports.buyProduct = buyProduct;
exports.releasePayment = releasePayment;