import Constants from '../config/constants';

export function getWorkouts() {
  return dispatch =>
    fetch(Constants.API_BASE_URL + 'workout/getall', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status) {
          dispatch(getSuccess(responseData));
        }
      })
      .catch(error => {
        console.log(error);
      });
}

export function validateWorkout(data) {
  console.log("inside validate workouts function")
  return dispatch => {
    return fetch(
      Constants.API_BASE_URL +
        'workout/validate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },body: JSON.stringify({
          userId: data.userId,
          videoId: data.videoId
        })
      }
    );
  };
}

export function validateAllWorkout(data) {
  return dispatch => {
    return fetch(
      Constants.API_BASE_URL +
        'workout/validate/all?accessToken=' +
        data.accessToken,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
  };
}

export function validatePromocode(data) {
  return dispatch => {
    return fetch(Constants.API_BASE_URL + 'promocode/validate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: data.accessToken,
        id: data.id,
        code: data.code,
      }),
    });
  };
}

export function getSuccess(response) {
  return {
    type: 'WORKOUT_LIST',
    response,
  };
}

export function getFailed(response) {
  return {
    type: 'WORKOUT_ERROR',
    response,
  };
}
