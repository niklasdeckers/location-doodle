import React, {Component} from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import * as globalStyles from "../../styles/global";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { getPosition } from '../../services/LocationService';
import Button from '../../components/Button';
import { setLocation } from '../../actions/LocationAction';
import { connect } from 'react-redux';

class MapModal extends Component {
  constructor() {
    super();

    this.state = {
      region: {
        latitude: 52.516278,
        longitude: 13.377532,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      location: null
    }

    this.updateCoordinates = this.updateCoordinates.bind(this);
    this.mapHasLoaded = this.mapHasLoaded.bind(this);
    this.chooseLocation = this.chooseLocation.bind(this);
  }

  updateCoordinates(e) {
    const { coordinate } = e.nativeEvent;

    this.setState({
      location: coordinate
    })
  }

  mapHasLoaded() {
    setTimeout(async () => {
      try {
        const location = await getPosition();
        const { latitude, longitude } = location;

        this.setState({
          location: location,
        })

        if(this.mapContainer) {
          this.mapContainer.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0321,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }, 500);
  }

  chooseLocation() {
    const { latitude, longitude } = this.state.location;

    const latlng = {
      latitude: latitude,
      longitude: longitude,
    }

    this.props.dispatch(setLocation(latlng));
    this.props.navigator.dismissLightBox();
  }

  render() {
    const { location } = this.state;

    let MapMarker;
    let pickLocationButton;

    if(location) {
      MapMarker = <Marker coordinate={ location } />

      pickLocationButton = <Button style={ styles.pickLocation } onClick={ this.chooseLocation }>
        Select Location
      </Button>
    }

    return (
      <View style={ [globalStyles.COMMON.modal, styles.container] }>
        <View style={ styles.mapContainer }>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={ map => {
              this.mapContainer = map;
            } }
            style={styles.map}
            onPress={ (e) => this.updateCoordinates(e) }
            onRegionChangeComplete={ (region) => { this.setState({region: region}) } }
            customMapStyle={ require('./map-style-light.js').default }
            showsUserLocation={ true }
            showsMyLocationButton={ false }
            onMapReady={ this.mapHasLoaded }
            region={this.state.region}>

            {
              MapMarker
            }
          </MapView>

          {
            pickLocationButton
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  mapContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  pickLocation: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
});

export default connect()(MapModal);
