import React from 'react';
import PropTypes from 'prop-types';
import * as globalStyles from '../../styles/global';
import {
  Text,
} from 'react-native';

const AppText = ({ children, style, ...rest }) => (
  <Text style={ [globalStyles.COMMON.text, style] } { ...rest }>
    { children }
  </Text>
);

AppText.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node.isRequired,
};

export default AppText;