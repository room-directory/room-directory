import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { stuffPublications } from '../stuff/StuffCollection';

export const roomResourcePublications = {
  resource: 'Resource',
  resourceAdmin: 'ResourceAdmin',
};

class RoomResourceCollection extends BaseCollection {
  constructor() {
    super('RoomResources', new SimpleSchema({
      room_number: String,
      capacity: Number,
      chairs: Number,
      desks: Number,
      tv: Number,
      phone_number: String,
      data_jacks: Number,
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
  define({ room_number, capacity, chairs, desks, tv, phone_number, data_jacks }) {
    const docID = this._collection.insert({
      room_number,
      capacity,
      chairs,
      desks,
      tv,
      phone_number,
      data_jacks,
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
  update(docID, { room_number, capacity, chairs, desks, tv, phone_number, data_jacks }) {
    const updateData = {};
    if (room_number) {
      updateData.room_number = room_number;
    }
    if (_.isNumber(capacity)) {
      updateData.capacity = capacity;
    }
    if (_.isNumber(chairs)) {
      updateData.chairs = chairs;
    }
    if (_.isNumber(desks)) {
      updateData.desks = desks;
    }
    if (_.isNumber(tv)) {
      updateData.tv = tv;
    }
    if (_.isNumber(phone_number)) {
      updateData.phone_number = phone_number;
    }
    if (_.isNumber(data_jacks)) {
      updateData.data_jacks = data_jacks;
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
      Meteor.publish(roomResourcePublications.room, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(stuffPublications.stuffAdmin, function publish() {
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
  subscribeRoomResource() {
    if (Meteor.isClient) {
      return Meteor.subscribe(roomResourcePublications.resource);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeRoomResourceAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(roomResourcePublications.resourceAdmin);
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
    const room_number = doc.room_number;
    const type = doc.type;
    return { room_number, type };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const RoomResources = new RoomResourceCollection();
