import { Meteor } from 'meteor/meteor';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

/* eslint-disable no-console */

function createUser(image, email, role, firstName, lastName, password, position) {
  console.log(`  Creating user ${email} with role ${role} and position ${position}.`);
  if (role === ROLE.ADMIN) {
    AdminProfiles.define({ image, email, firstName, lastName, password });
  } else { // everyone else is just a user.
    UserProfiles.define({ image, email, firstName, lastName, password, position });
  }
}

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ image, email, password, role, firstName, lastName, position }) => createUser(image, email, role, firstName, lastName, password, position));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
