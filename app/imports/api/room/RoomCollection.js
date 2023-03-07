import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const roomType = ['conference', 'lecture', 'study room', 'office'];
export const roomPublications = {
  room: 'Room',
};

class RoomCollection extends BaseCollection {
  constructor() {
    super('Room', new SimpleSchema({
      roomNumber: String,
      building: String,
      type: {
        type: String,
        allowedValues: roomType,
        defaultValue: 'conference',
      },
      isICS: {
        type: String,
        allowedValues: ['Yes', 'No'],
        defaultValue: 'Yes',
      },
      occupants: Array,
      'occupants.$': String,
      squareFt: Number,
    }));
  }

  /**
   * Defines a new Room item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @param condition the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ roomNumber, building, type, isICS, occupants, squareFt }) {
    const docID = this._collection.insert({
      roomNumber,
      building,
      type,
      isICS,
      occupants,
      squareFt,
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
  update(docID, { roomNumber, building, type, isICS, occupants, squareFt }) {
    const updateData = {};
    if (roomNumber) {
      updateData.roomNumber = roomNumber;
    }
    if (building) {
      updateData.building = building;
    }
    if (type) {
      updateData.type = type;
    }
    if (isICS !== this._collection.find(docID).isICS) {
      updateData.isICS = isICS;
    }
    if (occupants) {
      updateData.occupants = occupants;
    }
    if (_.isNumber(squareFt)) {
      updateData.squareFt = squareFt;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns boolean
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
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(roomPublications.room, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeRoom() {
    if (true) {
      return Meteor.subscribe(roomPublications.room);
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
    const roomNumber = doc.roomNumber;
    const building = doc.building;
    const type = doc.type;
    const isICS = doc.isICS;
    const occupants = doc.occupants;
    const squareFt = doc.squareFt;
    return { roomNumber, building, type, isICS, occupants, squareFt };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Room = new RoomCollection();
