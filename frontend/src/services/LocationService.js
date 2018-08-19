import { Linking, PermissionsAndroid } from "react-native";

/**
 * Retrieves the current user's location and returns it.
 */

export const getPosition = async () => {
  const position = await new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 3000,
    });
  });

  const date = new Date(position.timestamp).toISOString();

  const data = {
    "user": 2,
    "timestamp": date,
    ...position.coords,
  };

  return data;
};

/**
 * Clears the current running position watch.
 * @param {number} id - The id of the active watch position listener.
 */

export const clearWatch = (id) => {
  return navigator.geolocation.clearWatch(id);
};

/**
 * Asks for permission (ANDROID) to get the user's current location and
 * if granted, retrieves and returns it.
 */

export const getPositionWithPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'This app wants location access',
        'message': 'This app wants access to your current GPS location.',
      },
    );

    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
      const data = await getPosition();

      return data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const openLocationGoogleMaps = async (latitude, longitude) => {
  try {
    return await Linking.openURL(`http://maps.google.com/maps
      ?saddr=${latitude},${longitude}
      &daddr=${52.516282},${13.376848}
      &mode=d
    `);
  } catch (error) {
    console.log(error);
  }
};
