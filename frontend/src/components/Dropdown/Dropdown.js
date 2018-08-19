import React, { Component } from 'react';
import * as globalStyles from '../../styles/global';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, Picker,
} from 'react-native';

class Dropdown extends Component {
  constructor() {
    super();

    this.chooseLanguage = this.chooseLanguage.bind(this);
  }

  chooseLanguage(val) {
    const { items, onChange } = this.props;

    const currentItem = items.find(item => val === item.value);
    onChange(currentItem);
  }

  render() {
    const { selectedItem, items } = this.props;

    return (
      <View style={ styles.container }>
        <Picker
          selectedValue={ selectedItem.value }
          style={ styles.picker } itemStyle={ styles.pickerItem }
          onValueChange={ this.chooseLanguage }>

          {
            items.map(language => {
              return (
                <Picker.Item key={ language }
                             label={ language.label }
                             value={ language.value }/>
              );
            })
          }

        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: globalStyles.DEFAULT_BORDER_RADIUS,
  },
  picker: {
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#f1f1f1',
    color: '#222',
    padding: globalStyles.PADDING_MEDIUM,
    width: 250,
  },
  pickerItem: {
    color: '#ffffff',
  },
});

Dropdown.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
