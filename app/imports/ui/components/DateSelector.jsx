import React from 'react';
import { Form, Navbar, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import createReactClass from 'create-react-class';
import "react-datepicker/dist/react-datepicker.css";


const DateSelector = createReactClass({
  getInitialState() {
    return {
      date: new Date().toISOString(),
      previousDate: null,
      minDate: null,
      maxDate: null,
      focused: false,
      invalid: false
    };
  },
  handleChange(value) {
    this.setState({
      date: value
    });
  },

  render() {
    const today = new Date();
    //const LabelISOString = new Date().toISOString();
    return <DatePicker required onChange={this.handleChange} placeholder="Select a date" minDate={today} value={this.state.date} id="datepicker" />;
  }
});

/*const CustomControl = createReactClass({
  displayName: 'CustomControl',

  render() {
    const {
      value,
      placeholder,
      ...rest,
    } = this.props;

    return <Button {...rest}>{value || placeholder}</Button>;
  },
});*/

export default DateSelector;