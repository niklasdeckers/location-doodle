import { Navigation, NativeEventsReceiver } from 'react-native-navigation';
import App from './src/app';

(async () => {
  const isAppLaunched = await Navigation.isAppLaunched()

  if(isAppLaunched) {
    startApp();
  }

  new NativeEventsReceiver().appLaunched(startApp);
})()

const startApp = () => {
  new App();
}
