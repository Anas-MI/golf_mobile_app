import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function aboutUs() {
  return dispatch =>
    fetch(Constants.API_BASE_URL + 'aboutus', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: '123',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        if (responseData.status) {
          dispatch(onSuccess(responseData));
        } else {
          dispatch(onFail(responseData));
        }
      })
      .catch(error => {
        console.log(error);
      });
}

export function onSuccess(response) {
  return {
    type: 'ABOUT_SUCCESS',
    response,
  };
}

export function onFail(response) {
  Snackbar.show({
    title: response.message,
    duration: Snackbar.LENGTH_SHORT,
  });
  return {
    type: 'ABOUT_ERROR',
    response,
  };
}
