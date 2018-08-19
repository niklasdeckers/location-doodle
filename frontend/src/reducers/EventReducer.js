export default function reducer(state = {
  activeEvent: undefined
}, action) {

  switch (action.type) {
    case 'EVENT_SET': {
      return { ...state, activeEvent: action.payload };
    }

    default:
      return state;
  }
}
