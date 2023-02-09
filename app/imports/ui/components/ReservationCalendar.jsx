import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// TO DO: work on fixing the settings of the calendar

const localizer = momentLocalizer(moment);

const ReservationCalendar = ({ reservation }) => {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const events = [
    {
      start: reservation.startTime,
      end: reservation.endTime,
      resource: reservation.reservation_id,
      title: reservation.firstName,
      desc: reservation.email,
      allDay: false,
    },
  ];

  const event = events.map(item => item.title);

  const BlockTime = (
    <span style={{
      display: 'block',
      backgroundColor: '#003f18',
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 10,
      zIndex: 1,
    }}
    >
      {event.title}
    </span>
  );

  return (
    <div>
      <Calendar
        localizer={localizer}
        defaultView="week"
        views={['week', 'day']}
        events={events}
        // startAccessor="start"
        // endAccessor="end"
        // defaultDate={selectedDate}
        // onNavigate={date => setSelectedDate(date)}
        components={{
          event: BlockTime,
        }}
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
