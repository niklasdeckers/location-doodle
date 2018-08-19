import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Logo from '../../images/logo.png';

const Logotype = ({ style, ...rest }) => (
  <Image source={ Logo } style={ [styles.image, style] } { ...rest } />
);

Logotype.propTypes = {
  style: Image.propTypes.style,
};

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 80,
  },
});

export default Logotype;
