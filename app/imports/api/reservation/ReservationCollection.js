import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const reservationPublications = {
  reservation: 'Reservation',
  reservationAdmin: 'ReservationAdmin',
};

class ReservationCollection extends BaseCollection {
  constructor() {
    super('Reservations', new SimpleSchema({
      reservation_id: String,
      firstName: String,
      lastName: String,
      email: String,
      roomNumber: String,
      startTime: String,
      endTime: String,
      date: Date,
    }));
  }

  /**
   * Defines a new Stuff item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @param condition the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ reservation_id, firstName, lastName, email, roomNumber, startTime, endTime, date }) {
    const docID = this._collection.insert({
      reservation_id,
      firstName,
      lastName,
      email,
      roomNumber,
      startTime,
      endTime,
      date,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param quantity the new quantity (optional).
   * @param condition the new condition (optional).
   */
  update(docID, { reservation_id, firstName, lastName, email, roomNumber, startTime, endTime, date }) {
    const updateData = {};
    if (reservation_id) {
      updateData.reservation_id = reservation_id;
    }
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (email) {
      updateData.email = email;
    }
    if (roomNumber) {
      updateData.roomNumber = roomNumber;
    }
    if (startTime) {
      updateData.startTime = startTime;
    }
    if (endTime) {
      updateData.endTime = endTime;
    }
    if (date) {
      updateData.date = date;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the ReservationCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(reservationPublications.reservation, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(reservationPublications.reservationAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeReservation() {
    if (Meteor.isClient) {
      return Meteor.subscribe(reservationPublications.stuff);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeReservationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(reservationPublications.stuffAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const reservation_id = doc.reservation_id;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const email = doc.email;
    const roomNumber = doc.roomNumber;
    const startTime = doc.startTime;
    const endTime = doc.endTime;
    const date = doc.date;
    return { reservation_id, firstName, lastName, email, roomNumber, startTime, endTime, date };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Reservations = new ReservationCollection();
