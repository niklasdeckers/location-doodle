import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as globalStyles from "../../styles/global";
import Input from '../../components/Input/';
import Button from '../../components/Button/';
import { connect } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { userIsLoggedIn } from '../../actions/RootAction';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
    };

    this.logIn = this.logIn.bind(this);
  }

  async logIn() {
    const { dispatch } = this.props;
    const { username, password } = this.state;

    try {
      const res = await fetch(`http://locle.andy-rosslau.de:18181/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const json = await res.json();

      const { token } = json;

      if(token) {
        await Keychain.setGenericPassword(username, password);

        dispatch(initRoot({
          username: json.username,
          email: json.email,
          token: token,
          logged_in: true,
        }));
      } else {
      
      }
    } catch (err) {
      console.log(err);
    }

    dispatch(userIsLoggedIn(true));
  }

  render() {
    const { dispatch } = this.props;

    return (
      <View style={ [globalStyles.COMMON.container, styles.container] }>
        <Text style={ styles.title }>Register</Text>
        <Input customStyles={ styles.input }
               value={ this.state.username }
               handleInput={ (username) => this.setState({username: username}) }
               placeholder="Username"
               keyboardType={ 'email-address' }/>

        <Input customStyles={ styles.input }
               value={ this.state.password }
               handleInput={ (password) => this.setState({password: password}) }
               secureTextEntry={ true }
               placeholder="Password"/>

        <Button onClick={ this.logIn } style={ styles.login }>
          Log In
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: globalStyles.MARGIN_LARGE,
  },
  login: {
    width: 250,
  },
  logInText: {
    color: '#ffffff',
  },
  input: {
    width: 250,
    marginBottom: globalStyles.MARGIN_MEDIUM,
  },
  logo: {
    width: 65,
    height: 65,
    marginBottom: globalStyles.MARGIN_LARGE * 2,
  }
});

export default connect()(Login);
