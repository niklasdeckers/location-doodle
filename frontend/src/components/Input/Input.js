import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import * as globalStyles from "../../styles/global";
import PropTypes from 'prop-types';

class Input extends Component {
  constructor() {
    super();

    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    if(this.props.defaultValue) {
      this.props.handleInput(this.props.defaultValue);
    }
  }

  handleInput(text) {
    this.props.handleInput(text.text);
  }

  render() {
    const { customStyles, ...rest } = this.props;

    return (
      <View>
        <TextInput
          style={ [styles.input, customStyles] }
          onChangeText={ (text) => this.handleInput({ text }) }
          underlineColorAndroid={ 'transparent' }
          placeholderTextColor={ '#999999' }
          { ...rest }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#f1f1f1',
    color: '#222',
    padding: globalStyles.PADDING_MEDIUM,
    borderRadius: globalStyles.DEFAULT_BORDER_RADIUS,
  },
});

Input.propTypes = {
  handleInput: PropTypes.func.isRequired,
};

export default Input;
