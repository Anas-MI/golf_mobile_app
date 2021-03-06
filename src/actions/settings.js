import Constants from '../config/constants';
import Snackbar from 'react-native-snackbar';

export function settings(setting) {
  return dispatch =>
    fetch(Constants.API_BASE_URL + 'users/settings', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: '123',
      },
      body: JSON.stringify({
        accessToken: setting.accessToken,
        isEmailNotification: setting.isEmailNotification,
        isPushNotification: setting.isPushNotification,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('settings is', setting);
        if (responseData.status) {
          dispatch(onSuccess(responseData));
        } else {
          dispatch(onFailed(responseData));
        }
      })
      .catch(error => {
        console.log(error);
      });
}

export function onSuccess(response) {
  return {
    type: 'SETTING_SUCCESS',
    response,
  };
}

export function onFailed(response) {
  Snackbar.show({
    title: response.message,
    duration: Snackbar.LENGTH_SHORT,
  });
  return {
    type: 'SETTING_ERROR',
    response,
  };
}
