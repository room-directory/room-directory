import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from 'meteor/accounts-base';
import { UserProfiles } from './UserProfileCollection';

export const signUpNewUserMethod = new ValidatedMethod({
  name: 'UserProfiles.SignupNewUser',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ email, firstName, lastName, password, position }) {
    if (Meteor.isServer) {
      UserProfiles.define({ email, firstName, lastName, password, position });
    }
  },
});

export const updateUserPasswordMethod = new ValidatedMethod({
  name: 'UserProfiles.UpdateUserPassword',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ email, password }) {
    if (Meteor.isServer) {
      console.log('updateUserPasswordMethod(%o, %o)', email, password);
      // find meteor user from email and update password
      const user = Accounts.findUserByEmail(email);
      Accounts.setPassword(user._id, password, { logout: true });
    }
  },
});
