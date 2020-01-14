import Constants from '../config/constants';

export function addCardSubscription(data) {
  return dispatch => {
    return fetch(Constants.API_BASE_URL + 'ebook/charge', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      
        name: data.name,
        number: data.cardNumber,
        cvc: data.cvv,
        exp_month: data.month,
        exp_year: data.year,
        // id: data.id,
        amount: data.amount * 100,
        shippingId: data.shippingId,
      }),
    });
  };
}

export function addPaypalSubscription(data) {
  return dispatch => {
    return fetch(Constants.API_BASE_URL + 'paypal/buy', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: data.accessToken,
        id: data.id,
        amount: data.amount,
        shippingId: data.shippingId,
        user:data.userId
      }),
    });
  };
}
