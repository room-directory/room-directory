import React from 'react';
//import ReactDOM from 'react-dom';
import { Form, Navbar, Button, Row, FormGroup, Col } from 'react-bootstrap';
import Grid from 'react'
import DatePicker from 'react-datepicker';
import createReactClass from 'create-react-class';
//import "react-datepicker/dist/react-datepicker.css";


const DateSelector = createReactClass({
  getInitialState() {
    return {
      date: new Date(),
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
  handleMinChange(value) {
    this.setState({
      minDate: value
    });
  },
  handleMaxChange(value) {
    this.setState({
      maxDate: value
    });
  },
  handlePlacement() {
    return 'top';
  },
  handleRandomPlacement() {
    const placementKey = Math.floor((Math.random()*4) + 1);
    switch (placementKey) {
      case 1:
        return 'top';
      case 2:
        return 'left';
      case 4:
        return 'right';
      default:
        return 'bottom';
    }
  },
  handleValidationCheck(e) {
    e.preventDefault();
    this.setState(() => ({
      invalid: false
    }));
  },
  handleInvalidDate(e) {
    e.preventDefault();
    this.setState(() => ({
      invalid: true
    }));
  },
  handleResetValidation(e) {
    e.preventDefault();
    this.setState(() => ({
      invalid: false
    }));
  },

  render() {
    //const today = new Date();
    return <FormGroup controlId="required">
            <DatePicker required showIcon onChange={this.handleChange} selected={this.state.date} dateFormat="MM/dd/yyyy" placeholderText="Click to select a date" />
          </FormGroup>;
  }
});

/*const CustomControl = createReactClass({
  displayName: 'CustomControl',

  render() {
    const {
      value,
      placeholder,
      ...rest
    } = this.props;

    return <Button {...rest}>{value || placeholder}</Button>;
  },
});*/
//ReactDOM.render(<DateSelector />, document.getElementById('react'));
export default DateSelector;