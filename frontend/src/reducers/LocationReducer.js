export default function reducer(state = {
  latlng: {
    latitude: null,
    longitude: null,
  }
}, action) {

  switch (action.type) {
    case 'LOCATION_SET': {
      return { ...state, latlng: action.payload };
    }

    default:
      return state;
  }
}
