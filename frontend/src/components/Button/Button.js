import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as globalStyles from "../../styles/global";
import PropTypes from 'prop-types';

const Button = ({ children, style, onClick, ...rest }) => (
  <TouchableOpacity
    style={ [globalStyles.COMMON.button, style] }
    onPress={ onClick }
    { ...rest }>
    <Text style={{ color: '#ffffff' }}>
      { children }
    </Text>
  </TouchableOpacity>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
