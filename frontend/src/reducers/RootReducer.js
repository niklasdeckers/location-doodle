export default function reducer(state = {
  logged_in: false,
  appState: 'active',
  screen: 'Home',
  token: '',
}, action) {

  switch (action.type) {
    case 'ROOT_INIT': {
      return { ...state, ...action.payload };
    }

    case 'CURRENT_APP_STATE': {
      return { ...state, appState: action.payload };
    }

    case 'IS_LOGGED_IN': {
      return { ...state, logged_in: action.payload };
    }

    case 'APP_TOKEN_SET': {
      return { ...state, token: action.payload };
    }

    case 'ACTIVE_SCREEN_SET': {
      return { ...state, screen: action.payload };
    }

    default:
      return state;
  }
}
