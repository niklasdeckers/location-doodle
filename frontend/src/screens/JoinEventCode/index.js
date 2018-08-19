import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as globalStyles from "../../styles/global";
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { setEvent } from '../../actions/EventAction';

const mapStateToProps = (store) => {
  return {
    token: store.root.token,
  }
}

class Home extends Component {
  constructor() {
    super();

    this.state = {
      eventCode: ''
    }

    this.joinEventByCode = this.joinEventByCode.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  async joinEventByCode() {
    if(!this.state.eventCode) {
      return false;
    }

    try {
      const response = await fetch('http://locle.andy-rosslau.de:18181/api/events/' + this.state.eventCode, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': this.props.token,
        },
      })
      const json = await response.json();
      this.props.dispatch(setEvent(json));

      this.props.navigator.push({
        screen: 'app.JoinEvent',
        title: 'JoinEvent',
        animationType: 'slide-horizontal',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  goBack() {
    this.props.navigator.pop({
      animated: true,
      animationType: 'slide-horizontal',
    });
  }

  render() {
    return (
      <View style={[ globalStyles.COMMON.container, styles.container]}>
        <View style={ styles.buttonContainer }>
          <Input customStyles={ styles.input }
                 value={ this.state.eventCode }
                 handleInput={ (code) => this.setState({eventCode: code}) }
                 placeholder="Event Code"/>

            <Button onClick={ this.joinEventByCode } style={ [styles.button]}>
              Join Event
            </Button>
        </View>

        <TouchableOpacity style={ styles.backButtonContainer }
                          onPress={ this.goBack }>
          <Image
            style={styles.backButton}
            source={require('../../images/close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
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
  backButtonContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 10,
    top: 10,
    width: 30,
    height: 30,
    backgroundColor: '#222',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  input: {
    width: 250,
    marginBottom: globalStyles.MARGIN_MEDIUM,
  },
  button: {
    width: 250,
  },
});

export default connect(mapStateToProps)(Home);
