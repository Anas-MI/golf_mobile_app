import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function getFavorites(accessToken) {
  return dispatch =>
    fetch(
      Constants.API_BASE_URL + 'favorites/getAll',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseData => {
        console.log('at response data', responseData);
        if (responseData.status) {
          dispatch(getSuccess(responseData));
        } else {
          dispatch(getFailed(responseData));
        }
      })
      .catch(error => {
        console.log(error);
      });
}

export function getSuccess(response) {
  return {
    type: 'GETFAVORITE_SUCCESS',
    response,
  };
}

export function getFailed(response) {
  return {
    type: 'GETFAVORITE_ERROR',
    response,
  };
}
