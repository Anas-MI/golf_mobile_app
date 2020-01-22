export function fitGoals(state = {}, action) {
  switch (action.type) {
    case 'GETFITGOALS_SUCCESS':
      console.log({action})
      const userApiResponse = action.response.data;
      return Object.assign({}, userApiResponse);

    case 'GETFITGOALS_ERROR':
      const userErrorResponse = action.response.message;
      return Object.assign({}, userErrorResponse);

    default:
      return state;
  }
}
