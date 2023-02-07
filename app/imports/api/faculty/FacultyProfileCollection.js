import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const facultyProfilePublications = {
  faculty: 'Faculty',
  facultyAdmin: 'FacultyAdmin',
};

class FacultyProfileCollection extends BaseCollection {
  constructor() {
    super('FacultyProfile', new SimpleSchema({
      image: String,
      firstName: String,
      lastName: String,
      role: String,
      email: String,
      phone: String,
      officeHours: String,
      officeLocation: String,
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
  define({ image, firstName, lastName, email, officeHours, officeLocation, role, phone }) {
    const docID = this._collection.insert({
      image,
      firstName,
      lastName,
      email,
      officeHours,
      officeLocation,
      role,
      phone,
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
  update(docID, { image, firstName, lastName, email, officeHours, officeLocation, role, phone }) {
    const updateData = {};
    if (image) {
      updateData.image = image;
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
    if (officeHours) {
      updateData.officeHours = officeHours;
    }
    if (officeLocation) {
      updateData.officeLocation = officeLocation;
    }
    if (role) {
      updateData.role = role;
    }
    if (phone) {
      updateData.phone = phone;
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
      Meteor.publish(facultyProfilePublications.faculty, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(facultyProfilePublications.facultyAdmin, function publish() {
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
  subscribeFacultyProfile() {
    if (Meteor.isClient) {
      return Meteor.subscribe(facultyProfilePublications.faculty);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeFacultyProfileAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(facultyProfilePublications.facultyAdmin);
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
    const image = doc.image;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const email = doc.email;
    const officeHours = doc.officeHours;
    const officeLocation = doc.officeLocation;
    const phone = doc.phone;
    const role = doc.role;
    return { image, firstName, lastName, email, officeHours, officeLocation, phone, role };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const FacultyProfiles = new FacultyProfileCollection();
