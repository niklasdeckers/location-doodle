import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Switch } from 'react-native';

export class Toggle extends Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
  }
  
  toggle(toggled, title) {
    const { onChange } = this.props;
    
    onChange(toggled, title);
  }
  
  render() {
    const { title } = this.props;
    
    return (
      <View style={ styles.container }>
        <Switch value={ this.props.toggled }
                onValueChange={ (toggled) => this.toggle(toggled, title) }
                title={title}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                containerStyle={ styles.checkbox } />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  checkbox: {
    backgroundColor: 'transparent',
  },
});

Toggle.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Toggle;