import React from 'react';
import PropTypes from 'prop-types';
import * as globalStyles from '../../styles/global';
import AppText from './AppText';
import {
  StyleSheet,
  Text,
} from 'react-native';

const Title = ({ children, style, ...rest }) => (
  <AppText style={ [styles.title, style] } { ...rest }>
    { children }
  </AppText>
);

const styles = StyleSheet.create({
  title: {
    color: globalStyles.HEADLINE_COLOR,
    fontSize: globalStyles.HEADLINE_FONT_SIZE,
  },
});


Title.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node.isRequired,
};

export default Title;