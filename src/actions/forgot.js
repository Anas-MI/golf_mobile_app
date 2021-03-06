import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function forgotPassword(user) {
  return dispatch =>
    fetch(Constants.API_BASE_URL + 'users/forget', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: '123',
      },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData, user);
        if (responseData.status) {
          dispatch(loginSuccess(responseData));
        } else {
          dispatch(loginFailed(responseData));
        }
      })
      .catch(error => {
        console.log(error);
      });
}

export function loginSuccess(response) {
  return {
    type: 'FORGOT_SUCCESS',
    response,
  };
}

export function loginFailed(response) {
  Snackbar.show({
    title: response.message,
    duration: Snackbar.LENGTH_SHORT,
  });
  return {
    type: 'FORGOT_ERROR',
    response,
  };
}
