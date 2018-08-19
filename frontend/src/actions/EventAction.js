export function setEvent(event) {
  return {
    type: 'EVENT_SET',
    payload: event,
  };
}
