import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function content(data) {

  return dispatch =>
    fetch(
      Constants.API_BASE_URL +
        "journal/get/journals",
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: data.date
        }),
      },
    )
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
          dispatch(getSuccess(responseData.data));
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
    type: 'CONTENT_SUCCESS',
    response,
  };
}

export function getFailed(response) {
  return {
    type: 'CONTENT_ERROR',
    response,
  };
}
