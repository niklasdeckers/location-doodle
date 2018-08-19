import React, { Component } from 'react';
import { registerScreens } from './screens';
import Store from './Store';
import Providers from './Providers';
import { initLoginScreen, initScreens } from "./config/NavigationConfig";
import * as Keychain from 'react-native-keychain';
import { userIsLoggedIn } from './actions/RootAction';

class App extends Component {
  constructor() {
    super();

    console.disableYellowBox = true;

    registerScreens(Store, Providers);

    Store.subscribe(this.onStoreUpdate.bind(this));

    Store.dispatch(userIsLoggedIn(true));

    // (async () => {
    //   try {
    //     const credentials = await Keychain.getGenericPassword();
    //
    //     if(credentials) {
    //       const res = await fetch(`${API_URL}/auth/login/`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           username: credentials.username,
    //           password: credentials.password,
    //         }),
    //       });
    //
    //       const user = await res.json();
    //
    //       const { token, username, email } = user;
    //
    //       if(token) {
    //         await Store.dispatch(initRoot({
    //           username: username,
    //           email: email,
    //           token: token,
    //           logged_in: true,
    //         }));
    //       }
    //       else {
    //         await Keychain.resetGenericPassword();
    //         await Store.dispatch(userIsLoggedIn(false));
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    //
    //   await this.onStoreUpdate();
    // })().catch(err => {
    //   console.log(err);
    // });
  }

  async onStoreUpdate() {
    const loggedIn = Store.getState().root.logged_in;

    if(this.isLoggedIn != loggedIn) {
      this.isLoggedIn = loggedIn;

      this.initApp(loggedIn);
      console.log(`User is logged in: ${loggedIn}`);
    }
  }

  initApp(isLoggedIn) {
    switch (isLoggedIn) {
      case false:
        initLoginScreen()
          .then(() => {
            console.log('Initialized login screen');
          })
          .catch(err => {
            console.log('Login screen could not be initialized.');
            console.log(err);
          });

        return;

      case true:
        initScreens()
          .then(() => {
            console.log('Initialized home screen');
          })
          .catch(err => {
            console.log('Screens could not be initialized.');
            console.log(err);
          });

        return;

      default:
        return;
    }
  }
}

export default App;
