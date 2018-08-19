import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import * as globalStyles from "../../styles/global";
import { connect } from 'react-redux';
import { setAppToken } from '../../actions/RootAction';

const mapStateToProps = (store) => {
  return {
    activeEvent: store.events.activeEvent,
  }
}

class ViewEvent extends Component {
  constructor() {
    super();

    this.state = {
      region: {
        latitude: 52.516278,
        longitude: 13.377532,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    }

    this.goBack = this.goBack.bind(this);
    this.fitToCoordinates = this.fitToCoordinates.bind(this);
  }

  async componentDidMount() {
    // try {
    //   const response = await fetch('http://locle.andy-rosslau.de:18181/api/auth');
    //   const json = await response.json();
    //
    //   await AsyncStorage.setItem('@TokenStore:Token', json);
    //   this.props.dispatch(setAppToken(json));
    //   console.log(json);
    // } catch (error) {
    //   console.log(error);
    // }

    this.fitToCoordinates();
  }

  goBack() {
    this.props.navigator.popToRoot({
      animated: true,
      animationType: 'fade',
    });
  }

  fitToCoordinates() {
    const latlng = this.props.activeEvent.participants.map(participant => {
      return {
        latitude: participant.location.lat,
        longitude: participant.location.lng,
      }
    })

    latlng.push({ latitude: 52.521443, longitude: 13.306226 })

    setTimeout(() => {
      this.mapContainer.fitToCoordinates(latlng, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }
      })
    }, 200)
  }

  render() {
    return (
      <View style={ [globalStyles.COMMON.container, styles.container] }>
        <View style={ styles.mapContainer }>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={ map => {
              this.mapContainer = map;
            } }
            style={styles.map}
            customMapStyle={ require('./map-style-light.js').default }
            region={this.state.region}>

            {
              this.props.activeEvent.participants.map((participant, i) => {
                const latlng = {
                  latitude: participant.location.lat,
                  longitude: participant.location.lng,
                }

                return <Marker key={participant.displayName + '-' + i} coordinate={ latlng }/>
              })
            }

            <Marker coordinate={ { latitude: 52.521443, longitude: 13.306226 } } />

            <Circle center={{ latitude: 52.523779, longitude: 13.357018 }}
              radius={ 150 }
              strokeWidth={ 2 }
              zIndex={ 5001 }
              strokeColor={ "#ffffff" }
              fillColor={ "#0000ff" } />
          </MapView>
        </View>

        <View style={ styles.metaContainer }>
          <Text style={ [globalStyles.COMMON.title, styles.title] }>Participants</Text>
          {
            this.props.activeEvent.participants.map((participant) => {
                return <Text key={participant.displayName} style={ styles.participant }>{ participant.displayName }</Text>
            })
          }

          <Text style={ styles.participant }>Erik</Text>
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
  metaContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  participant: {
    fontSize: 18,
  },
  map: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
});

export default connect(mapStateToProps)(ViewEvent);
