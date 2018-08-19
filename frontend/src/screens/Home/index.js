import React, {Component} from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import Button from '../../components/Button';
import Logotype from '../../components/Logotype';
import * as globalStyles from "../../styles/global";
import { AsyncStorage } from "react-native"
import { setAppToken } from '../../actions/RootAction';
import { connect } from 'react-redux';

class Home extends Component {
  constructor() {
    super();

    this.createEvent = this.createEvent.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('@TokenStore:Token')

    if(!token) {
      const response = await fetch('http://locle.andy-rosslau.de:18181/api/auth');
      const json = await response.json();

      try {
        await AsyncStorage.setItem('@TokenStore:Token', json);
        this.props.dispatch(setAppToken(json));
      } catch (error) {
        console.log(error);
      }
    } else {
      this.props.dispatch(setAppToken(token));
    }
  }

  createEvent() {
    this.props.navigator.push({
      screen: 'app.CreateEvent',
      title: 'CreateEvent',
      animationType: 'slide-horizontal',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
  }

  joinEvent() {
    this.props.navigator.push({
      screen: 'app.JoinEventCode',
      title: 'JoinEventCode',
      animationType: 'slide-horizontal',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
  }

  render() {
    return (
      <ImageBackground style={styles.backgroundImage} source={require('../../images/partybg.png')}>

        <View style={ styles.logoContainer }>
          <Logotype />
        </View>

        <View style={ styles.buttonContainer }>
          <Button onClick={ this.createEvent } style={ [styles.button, styles.create]}>
            Create Event
          </Button>

          <Button onClick={ this.joinEvent } style={ [styles.button, styles.join] }>
            <Text style={{ color: '#222' }}>Join Event</Text>
          </Button>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 60,
  },
  container: {
    padding: 20,
  },
  button: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    marginTop: 25,
  },
  backgroundImage: {
    flex: 1,
  },
  create: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  join: {
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#fff',
  }
});

export default connect()(Home);
