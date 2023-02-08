import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker';
import { PAGE_IDS } from '../utilities/PageIDs';
import RoomDropdown from '../components/RoomDropdown';
import { Room } from '../../api/room/RoomCollection';
import LoadingSpinner from '../components/LoadingSpinner';
<<<<<<< HEAD
import DateSelector from '../components/DateSelector';
import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datepicker/dist/react-datepicker.css';
=======
>>>>>>> parent of c755969 (Merge branch 'main' into issue-067)

function RoomType(room) {
  const lecture = [];
  const office = [];
  const conference = [];
  const study = [];

  for (let i = 0; i < room.length; i++) {
    if (room[i].type === 'lecture') {
      lecture.push(room[i]);
    } else if (room[i].type === 'office') {
      office.push(room[i]);
    } else if (room[i].type === 'conference') {
      conference.push(room[i]);
    } else if (room[i].type === 'study room') {
      study.push(room[i]);
    }
  }
  // TO DO: Fix study room type
  const types = {
    lecture: lecture,
    office: office,
    conference: conference,
    study: study,
  };

  return types;
}

/* An interactive page with different components that reflects the reservations made. */
const AdminReservation = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
<<<<<<< HEAD
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  /* const handleDate = (chosenDate) => {
    setDate(chosenDate);
  }; */
=======
>>>>>>> parent of c755969 (Merge branch 'main' into issue-067)
  const { rooms, ready } = useTracker(() => {
    const subscription = Room.subscribeRoom();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    const items = Room.find({}).fetch();
    return {
      rooms: items,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.ADMIN_RESERVATION} className="py-3">
      <Row>
        <Col>
          <DropdownButton title="Select Room...">
            <Dropdown.Header>Lecture</Dropdown.Header>
            {(RoomType(rooms).lecture).map((room) => <RoomDropdown key={room.type} room={room} />)}
            <Dropdown.Divider />
            <Dropdown.Header>Office</Dropdown.Header>
            {(RoomType(rooms).office).map((room) => <RoomDropdown key={room.type} room={room} />)}
            <Dropdown.Divider />
            <Dropdown.Header>Conference</Dropdown.Header>
            {(RoomType(rooms).conference).map((room) => <RoomDropdown key={room.type} room={room} />)}
            <Dropdown.Divider />
            <Dropdown.Header>Study Room</Dropdown.Header>
            {(RoomType(rooms).study).map((room) => <RoomDropdown key={room.type} room={room} />)}
          </DropdownButton>
          <Button variant="primary" onClick={handleShow}>Make Reservation</Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reserve Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
<<<<<<< HEAD
              <DatePicker required showIcon selected={startDate} dateFormat="MM/dd/yyyy" onChange={(date) => setStartDate(date)} />
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Start time</Form.Label>
                <DatePicker required showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" selected={startTime} onChange={(time) => setStartTime(time)} />
                <Form.Label>End time</Form.Label>
                <DatePicker required showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" selected={endTime} onChange={(time) => setEndTime(time)} />
              </Col>

=======
              <Form.Control placeholder="Enter date" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control placeholder="Start" />
              <Form.Control placeholder="End" />
>>>>>>> parent of c755969 (Merge branch 'main' into issue-067)
            </Form.Group>
            <Form.Group>
              <div>
                <Form.Check
                  type="checkbox"
                  id="recurrence-radio"
                  label="Recurring Event"
                />
                <Form.Check
                  label="Daily"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-1"
                />
                <Form.Check
                  label="Weekly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-2"
                />
                <Form.Check
                  label="Monthly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-3"
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder="First Name, Last Name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control placeholder="John@Foo.com" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminReservation;
