import { Navigation } from 'react-native-navigation';

import Home from './Home';
import Login from './Login';
import CreateEvent from './CreateEvent';
import JoinEvent from './JoinEvent';
import JoinEventCode from './JoinEventCode';
import ViewEvent from './ViewEvent';
import MapModal from './MapModal';

export const registerScreens = (store, Provider) => {
  Navigation.registerComponent('app.Home', () => Home, store, Provider);
  Navigation.registerComponent('app.Login', () => Login, store, Provider);
  Navigation.registerComponent('app.CreateEvent', () => CreateEvent, store, Provider);
  Navigation.registerComponent('app.JoinEvent', () => JoinEvent, store, Provider);
  Navigation.registerComponent('app.JoinEventCode', () => JoinEventCode, store, Provider);
  Navigation.registerComponent('app.ViewEvent', () => ViewEvent, store, Provider);
  Navigation.registerComponent('app.MapModal', () => MapModal, store, Provider);
}
