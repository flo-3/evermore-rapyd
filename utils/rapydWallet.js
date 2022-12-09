const makeRequest = require('./rapydConnect').makeRequest;

function createWalletReference(entity, entityId) {
  return entity.firstname + '-' + entity.lastname + '-' + entityId;
}

async function createPersonalWallet(user, userId) {
  try {
    const body = {
      first_name: user.firstname,
      last_name: user.lastname,
      ewallet_reference_id: createWalletReference(user, userId + 50),
      type: 'person',
      contact: {
        contact_type: 'personal',
        email: user.email,
        first_name: user.firstname,
        last_name: user.lastname,
      }
    };
    const result = await makeRequest('POST', '/v1/user', body);
    console.log(result);
    return {
        ...user,
        ...result.body.data
    };
  } catch (error) {
    console.error('Error completing request', error);
    return null;
  }
}

async function createCompanyWallet(company, companyId) {
  try {
    const body = {
      first_name: company.firstname,
      last_name: company.lastname,
      ewallet_reference_id: createWalletReference(company, companyId),
      type: 'company',
      metadata: {
        merchant_defined: true
      },
      contact: {
        contact_type: 'business',
        email: company.email,
        first_name: company.firstname,
        last_name: company.lastname,
      }
    };
    const result = await makeRequest('POST', '/v1/user', body);
    return {
        ...company,
        ...result.body.data
    };
  } catch (error) {
    console.error('Error completing request', error);
    return null;
  }
}

exports.createPersonalWallet = createPersonalWallet;
exports.createCompanyWallet = createCompanyWallet;