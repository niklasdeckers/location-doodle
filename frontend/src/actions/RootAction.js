export function initRoot(state) {
  return {
    type: 'ROOT_INIT',
    payload: state,
  };
}

export function currentAppState(state) {
  return {
    type: 'CURRENT_APP_STATE',
    payload: state,
  };
}

export function userIsLoggedIn(loggedIn) {
  return {
    type: 'IS_LOGGED_IN',
    payload: loggedIn,
  };
}

export function setActiveScreen(screen) {
  return {
    type: 'ACTIVE_SCREEN_SET',
    payload: screen,
  };
}

export function setAppToken(token) {
  return {
    type: 'APP_TOKEN_SET',
    payload: token,
  };
}
