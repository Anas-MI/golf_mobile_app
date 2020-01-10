import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function dateContent(data) {
  return dispatch =>
    fetch(
      Constants.API_BASE_URL +
        "synergistic/get/synergy",
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateToFind: data.date,
          date: data.date
        }),
      },
    )
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
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
    type: 'DATECONTENT_SUCCESS',
    response,
  };
}

export function getFailed(response) {
  return {
    type: 'DATECONTENT_ERROR',
    response,
  };
}
