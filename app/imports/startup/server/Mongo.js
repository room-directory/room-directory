import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Reservations } from '../../api/reservation/ReservationCollection';
import { Room } from '../../api/room/RoomCollection';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
/* eslint-disable no-console */

// Initialize the database with a default stuff data document.
function addStuffData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the database with a default reservation data document.
function addReservationData(data) {
  console.log(`  Adding reservation for (${data.email})`);
  Reservations.define(data);
}

// Initialize the database with a default room data document.
function addRoomData(data) {
  console.log(`  Adding: (${data.roomNumber})`);
  Room.define(data);
}

// Initialize the database with a default faculty profile data document.
function addFacultyProfileData(data) {
  console.log(`  Adding: ${data.firstName} ${data.lastName}`);
  FacultyProfiles.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultStuffData) {
    console.log('Creating default stuff data.');
    Meteor.settings.defaultStuffData.map(data => addStuffData(data));
  }
}

// Initialize the ReservationCollection if empty.
if (Reservations.count() === 0) {
  if (Meteor.settings.defaultReservationData) {
    console.log('Creating default reservations data.');
    Meteor.settings.defaultReservationData.map(data => addReservationData(data));
  }
}

// Initialize the RoomCollection if empty.
if (Room.count() === 0) {
  if (Meteor.settings.defaultRoomData) {
    console.log('Creating default room data.');
    Meteor.settings.defaultRoomData.map(data => addRoomData(data));
  }
}

// Initialize the FacultyProfileCollection if empty.
if (FacultyProfiles.count() === 0) {
  if (Meteor.settings.defaultFacultyData) {
    console.log('Creating default faculty profiles data.');
    Meteor.settings.defaultFacultyData.map(data => addFacultyProfileData(data));
  }
}
