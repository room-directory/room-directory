import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Reservations } from '../../api/reservation/ReservationCollection';

// TO DO: work on fixing the settings of the calendar

const localizer = momentLocalizer(moment);
const events = [
  {
    id: Reservations.reservation_id,
    // start: Reservations.reservation_id.startTime(),
    // end: Reservations.reservation_id.endTime(),
    // title: Reservations.reservation_id.firstName + Reservations.reservation_id.lastName,
    start: new Date(),
    end: new Date(moment().add(1, 'days')),
    title: 'Sample',
  }];

const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        defaultDate={selectedDate}
        onNavigate={date => setSelectedDate(date)}
      />
    </div>
  );

};

/* Referencing the Reservations Collection */
ReservationCalendar.propTypes = {
  reservation: PropTypes.shape({
    reservation_id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    roomNumber: PropTypes.string,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
  }).isRequired,
};

export default ReservationCalendar;
