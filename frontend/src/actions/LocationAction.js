export function setLocation(latlng) {
  return {
    type: 'LOCATION_SET',
    payload: latlng,
  };
}
