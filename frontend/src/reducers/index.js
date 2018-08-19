import { combineReducers } from 'redux';

import root from './RootReducer';
import location from './LocationReducer';
import events from './EventReducer';

export default combineReducers({
  root,
  location,
  events
});
