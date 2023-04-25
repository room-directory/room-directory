import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const facultyProfilePublications = {
  faculty: 'Faculty',
};

export const titles = ['Associate Professor', 'Assistant Research Professor', 'Professor', 'Instructor', 'Faculty Specialist', 'Assistant Professor', 'Department Chair', 'Curriculum Committee Chair',
  'Graduate Program Chair', 'Professor Emeritus', 'Computational Scientist', 'Undergraduate Academic Advisor', 'Admin. and Fiscal Support', 'IT System Admin.', 'IT Network/System Admin.'];

class FacultyProfileCollection extends BaseCollection {
  constructor() {
    super('FacultyProfile', new SimpleSchema({
      image: String,
      firstName: String,
      lastName: String,
      role: Array,
      'role.$': {
        type: String,
        allowedValues: titles,
      },
      email: String,
      phone: [String],
      officeHours: String,
      officeLocation: [String],
    }));
  }

  /**
   * Defines a new Faculty profile.
   * @param image link or location of image.
   * @param firstName first name of faculty member.
   * @param lastName last name of the faculty member.
   * @param email email of the faculty member.
   * @param officeHours office hours of faculty member.
   * @param officeLocation building and room number of office.
   * @param role job title of faculty member.
   * @param phone phone number of faculty member.
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
   * @param docID the id of the document to update (optional).
   * @param image link or location of image (optional).
   * @param firstName first name of faculty member (optional).
   * @param lastName last name of the faculty member (optional).
   * @param email email of the faculty member (optional).
   * @param officeHours office hours of faculty member (optional).
   * @param officeLocation building and room number of office (optional).
   * @param role job title of faculty member (optional).
   * @param phone phone number of faculty member (optional).
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
   * It publishes the entire collection for all users (no login required).
   */
  publish() {
    if (Meteor.isServer) {
      // get the faculty profile collection instance.
      const instance = this;
      /** This subscription publishes to all users */
      Meteor.publish(facultyProfilePublications.faculty, function publish() {
        return instance._collection.find();
      });
    }
  }

  /**
   * Subscription method for faculty profile collection.
   */
  subscribeFacultyProfile() {
    if (Meteor.isClient) {
      return Meteor.subscribe(facultyProfilePublications.faculty);
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
