import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Reservations } from '../../api/reservation/ReservationCollection';
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
