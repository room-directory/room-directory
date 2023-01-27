import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const requestStatus = ['pending faculty approval', 'pending office approval', 'approved', 'denied'];
export const studentRequestPublications = {
  request: 'StudentRequest',
  requestAdmin: 'StudentRequestAdmin',
};

class StudentRequestCollection extends BaseCollection {
  constructor() {
    super('StudentRequests', new SimpleSchema({
      requestID: String,
      firstName: String,
      lastName: String,
      email: String,
      roomNumber: String,
      startTime: String,
      endTime: String,
      date: Date,
      status: {
        type: String,
        allowedValues: requestStatus,
        defaultValue: 'pending faculty approval',
      },
      reason: String,
      numPeople: Number,
    }));
  }

  /**
   * Defines a new Request item.
   * @return {String} the docID of the new document.
   */
  define({ requestID, firstName, lastName, email, roomNumber, startTime, endTime, date, status, reason, numPeople }) {
    const docID = this._collection.insert({
      requestID,
      firstName,
      lastName,
      email,
      roomNumber,
      startTime,
      endTime,
      date,
      status,
      reason,
      numPeople,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   */
  update(docID, { requestID, firstName, lastName, roomNumber, startTime, endTime, date, status, reason, numPeople }) {
    const updateData = {};
    if (requestID) {
      updateData.requestID = requestID;
    }
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
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
    if (status) {
      updateData.status = status;
    }
    if (reason) {
      updateData.reason = reason;
    }
    if (_.isNumber(numPeople)) {
      updateData.numPeople = numPeople;
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
   * It publishes the entire collection for admin and just the request associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the RequestCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(studentRequestPublications.request, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(studentRequestPublications.requestAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for request owned by the current user.
   */
  subscribeRequest() {
    if (Meteor.isClient) {
      return Meteor.subscribe(studentRequestPublications.request);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeRequestAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(studentRequestPublications.requestAdmin);
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
    const requestID = doc.requestID;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const email = doc.email;
    const roomNumber = doc.roomNumber;
    const startTime = doc.startTime;
    const endTime = doc.endTime;
    const date = doc.date;
    const status = doc.status;
    const reason = doc.reason;
    const numPeople = doc.numPeople;
    return { requestID, firstName, lastName, email, roomNumber, startTime, endTime, date, status, reason, numPeople };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const StudentRequests = new StudentRequestCollection();
