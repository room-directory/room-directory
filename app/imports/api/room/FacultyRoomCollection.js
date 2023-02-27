import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const facultyRoomPublications = {
  facultyRoom: 'FacultyRoom',
};

class FacultyRoomCollection extends BaseCollection {
  constructor() {
    super('RoomResources', new SimpleSchema({
      building: String,
      roomNumber: String,
      facultyEmail: String,
    }));
  }

  /**
   * Defines a new Room item.
   * @param building the building the room is in.
   * @param roomNumber the room number of the room.
   * @param facultyEmail the email of the faculty member.
   */
  define({ building, roomNumber, facultyEmail }) {
    const docID = this._collection.insert({
      building,
      roomNumber,
      facultyEmail,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param building the building the room is in. (optional)
   * @param roomNumber the room number of the room. (optional)
   * @param facultyEmail the email of the faculty member. (optional)
   */
  update(docID, { building, roomNumber, facultyEmail }) {
    const updateData = {};
    if (building) {
      updateData.building = building;
    }
    if (roomNumber) {
      updateData.roomNumber = roomNumber;
    }
    if (facultyEmail) {
      updateData.facultyEmail = facultyEmail;
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
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(facultyRoomPublications.facultyRoom, function publish() {
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
  subscribeRoomResource() {
    if (Meteor.isClient) {
      return Meteor.subscribe(facultyRoomPublications.facultyRoom);
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
    const building = doc.building;
    const roomNumber = doc.roomNumber;
    const facultyEmail = doc.facultyEmail;
    return { building, roomNumber, facultyEmail };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const FacultyRooms = new FacultyRoomCollection();
