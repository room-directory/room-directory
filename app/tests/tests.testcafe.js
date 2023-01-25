// import { Selector, t } from 'testcafe';
import { /* manageDatabasePage, */ signOutPage, studentRequestPage, facultyRequestPage, roomListPage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { navBar } from './navbar.component';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const newCredentials = { username: 'jane@foo.com', password: 'changeme' };

fixture('meteor-application-template-production localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await landingPage.isDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await navBar.isLoggedIn(newCredentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoFacultyRequestsPage();
  await facultyRequestPage.isDisplayed();
  await navBar.gotoStudentRequestsPage();
  await studentRequestPage.isDisplayed();
  // await navBar.gotoManageDatabasePage();
  // await manageDatabasePage.isDisplayed();
});
