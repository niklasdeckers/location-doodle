import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Clipboard } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as globalStyles from "../../styles/global";
import { getPosition } from '../../services/LocationService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import { setLocation } from '../../actions/LocationAction';
import { setEvent } from '../../actions/EventAction';
import moment from 'moment';

const mapStateToProps = (store) => {
  return {
    selectedLocation: store.location.latlng,
    activeEvent: store.events.activeEvent,
    token: store.root.token,
  }
}

class JoinEvent extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      location: '',
    }

    this.goBack = this.goBack.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
    this.openLocationModal = this.openLocationModal.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(setLocation({
      latitude: null,
      longitude: null,
    }))
  }

  openLocationModal() {
    this.props.navigator.showLightBox({
      screen: 'app.MapModal',
      passProps: {},
      style: {
        backgroundBlur: 'light',
        backgroundColor: '#1d1d2580',
        tapBackgroundToDismiss: true,
      },
    });
  }

  goBack() {
    this.props.navigator.popToRoot({
      animated: true,
      animationType: 'fade',
    });
  }

  async joinEvent() {
    const data = {
      participant_display_name: this.state.name,
      participant_location: {
        lat: this.props.selectedLocation.latitude,
        lng: this.props.selectedLocation.longitude
      }
    }

    try {
      const response = await fetch('http://locle.andy-rosslau.de:18181/api/events/' + this.props.activeEvent.eventId + '/participants', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': this.props.token,
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      console.log('LOGGING EVENT');
      console.log(json);
      this.props.dispatch(setEvent(json));

      this.props.navigator.push({
        screen: 'app.ViewEvent',
        title: 'ViewEvent',
        animationType: 'slide-horizontal',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  copyToClipboard() {
    Clipboard.setString(this.props.activeEvent.eventId);
  }

  render() {
    const { location } = this.state;
    const { selectedLocation, activeEvent } = this.props;

    let CurrentMapLocation;
    let JoinEventButton;

    if(selectedLocation.latitude && selectedLocation.longitude) {
      CurrentMapLocation = <View pointerEvents="none" style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={ map => {
            this.mapContainer = map;
          } }
          style={styles.map}
          customMapStyle={ require('./map-style-light.js').default }
          region={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>

          <Marker coordinate={ selectedLocation } />
        </MapView>
      </View>

      JoinEventButton = <Button style={ styles.button } onClick={ this.joinEvent }>
        Join Event
      </Button>
    }

    let eventName;
    let eventId;
    let eventTime;

    if(activeEvent) {
      eventName = <Text>Event Name: { activeEvent.displayName }</Text>
      eventId = <View style={ styles.eventCodeContainer }>
        <Text>Event Code: </Text>

        <TouchableOpacity onPress={ this.copyToClipboard }>
          <Text style={{ fontWeight: '700' }}>{ activeEvent.eventId }</Text>
        </TouchableOpacity>
      </View>

      const date = moment(activeEvent.startTime.date).format("DD.MM.YYYY");
      const day = moment(activeEvent.startTime.date).format('dddd');
      const time = moment(activeEvent.startTime.date).format('HH:mm');

      eventTime = <Text>Event Time: {date}, {day} at {time}</Text>
    }

    return (
      <View style={ [globalStyles.COMMON.container, styles.container] }>
        <View style={ styles.eventMetaContainer }>
          <Text style={ [globalStyles.COMMON.title, styles.title] }>About the event</Text>

          {
            eventName
          }

          {
            eventTime
          }

          {
            eventId
          }
        </View>

        {
          CurrentMapLocation
        }

        <View style={ styles.inputContainer }>
          <Input customStyles={ styles.input }
                 value={ this.state.name }
                 handleInput={ (name) => this.setState({name: name}) }
                 placeholder="Your name"/>

           <TouchableOpacity style={ styles.pickLocation } onPress={ this.openLocationModal }>
             <Text style={{ color: '#fff' }}>Pick your starting point</Text>
             <Image source={require('../../images/area.png')} style={ styles.areaImage } />
           </TouchableOpacity>

           {
             JoinEventButton
           }
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
    width: 250,
  },
  title: {
    textAlign: 'center',
  },
  eventMetaContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    marginTop: 25,
    alignItems: 'center',
  },
  input: {
    width: 250,
    marginBottom: globalStyles.MARGIN_MEDIUM,
  },
  pickLocation: {
    width: 250,
    backgroundColor: '#c1c1c1',
    marginBottom: globalStyles.MARGIN_MEDIUM,
    padding: 15,
    borderRadius: globalStyles.DEFAULT_BORDER_RADIUS,
    flexDirection: 'row',
  },
  eventCodeContainer: {
    flexDirection: 'row',
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
  mapContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  map: {
    flex: 1,
  },
  areaImage: {
    tintColor: '#fff',
    width: 20,
    height: 20,
    marginLeft: 'auto'
  }
});

export default connect(mapStateToProps)(JoinEvent);
