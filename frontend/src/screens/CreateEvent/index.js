import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import * as globalStyles from "../../styles/global";
import Dropdown from '../../components/Dropdown';
import { Filters } from './filters';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { connect } from 'react-redux';
import { setEvent } from '../../actions/EventAction';

const mapStateToProps = (store) => {
  return {
    token: store.root.token,
  }
}

class CreateEvent extends Component {
  constructor() {
    super();

    this.state = {
      eventName: '',
      datetime: null,
      selectedFilter: {
        label: '',
        value: '',
      },
      isDateTimePickerVisible: false,
    }

    this.goBack = this.goBack.bind(this);
    this.chooseFilter = this.chooseFilter.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
  }

  goBack() {
    this.props.navigator.pop({
      animated: true,
      animationType: 'slide-horizontal',
    });
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    this.setState({
      datetime: date
    })

    this.hideDateTimePicker();
  };

  chooseFilter(item) {
    this.setState({
      selectedFilter: item
    })
  }

  async createEvent() {
    const { eventName, datetime, selectedFilter } = this.state;

    const data = {
      event_display_name: eventName,
      event_start_time: datetime.toISOString(),
      event_topic: selectedFilter.value
    }

    try {
      const response = await fetch('http://locle.andy-rosslau.de:18181/api/events', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': this.props.token,
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      this.props.dispatch(setEvent(json));

      this.props.navigator.push({
        screen: 'app.JoinEvent',
        title: 'JoinEvent',
        animationType: 'slide-horizontal',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  render() {
    const { datetime } = this.state;

    let DateTimeText = <Text>Pick date</Text>;

    if(datetime) {
      const date = moment(Date.parse(datetime)).format("DD.MM.YYYY");
      const day = moment(Date.parse(datetime)).format('dddd');
      const time = moment(Date.parse(datetime)).format('HH:mm');

      DateTimeText = <Text>{date}, {day} at {time}</Text>
    }

    return (
      <View style={ [globalStyles.COMMON.container, styles.container] }>
        <Text style={[globalStyles.COMMON.title, styles.title]}>Create Event</Text>

        <View style={ styles.inputContainer }>
          <Input customStyles={ styles.input }
                 value={ this.state.eventName }
                 handleInput={ (eventName) => this.setState({eventName: eventName}) }
                 placeholder="Event"/>

            <TouchableOpacity style={ styles.dateTimePicker } onPress={this.showDateTimePicker}>
              { DateTimeText }
            </TouchableOpacity>

            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />

            <Dropdown selectedItem={ this.state.selectedFilter }
                      items={ Filters }
                      onChange={ this.chooseFilter }/>

            <Button style={ styles.button } onClick={ this.createEvent }>
              Create
            </Button>
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
  button: {
    width: 250,
  },
  title: {
    textAlign: 'center',
    marginTop: 25,
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    marginTop: 25,
    alignItems: 'center',
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
  input: {
    width: 250,
    marginBottom: globalStyles.MARGIN_MEDIUM,
  },
  dateTimePicker: {
    width: 250,
    backgroundColor: '#f1f1f1',
    marginBottom: globalStyles.MARGIN_MEDIUM,
    padding: 15,
    borderRadius: globalStyles.DEFAULT_BORDER_RADIUS
  }
});

export default connect(mapStateToProps)(CreateEvent);
