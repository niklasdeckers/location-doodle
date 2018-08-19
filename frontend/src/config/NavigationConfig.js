import { Navigation } from "react-native-navigation";

const sharedStyling = {
  navBarHidden: true,
};

export const initLoginScreen = async () => {
  await Navigation.startSingleScreenApp({
    screen: {
      label: 'Login',
      screen: 'app.Login',
      title: 'Login',
      navigatorStyle: {
        ...sharedStyling,
      },
    },
    animationType: 'fade',
  });
};

export const initScreens = async () => {
  await Navigation.startSingleScreenApp({
    screen: {
      screen: 'app.Home',
      title: 'Home',
      navigatorStyle: {
        ...sharedStyling,
      },
    },
    animationType: 'fade',
  });
};
