// import { Selector, t } from 'testcafe';
import { /* manageDatabasePage, */ signOutPage, roomListPage, facultyInformationPage, clubInformationPage, profilePage, adminManagePage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { navBar } from './navbar.component';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const studentCredentials = { username: 'student@foo.com', password: 'changeme' };
const officeCredentials = { username: 'office@foo.com', password: 'changeme' };
const techCredentials = { username: 'tech@foo.com', password: 'changeme' };
const facultyCredentials = { username: 'faculty@foo.com', password: 'changeme' };
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
  await landingPage.isDisplayedLoggedin();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await navBar.isLoggedIn(newCredentials.username);
  await landingPage.isDisplayedLoggedin();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that non-signed in user pages show up', async () => {
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
});

test('Test that student pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(studentCredentials.username, studentCredentials.password);
  await navBar.isLoggedIn(studentCredentials.username);
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
  // Profile
  await navBar.gotoProfilePage();
  await profilePage.isDisplayed();
  // Room List
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that faculty user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(facultyCredentials.username, facultyCredentials.password);
  await navBar.isLoggedIn(facultyCredentials.username);
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
  // Profile
  await navBar.gotoProfilePage();
  await profilePage.isDisplayed();
  // Room List
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that Office user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(officeCredentials.username, officeCredentials.password);
  await navBar.isLoggedIn(officeCredentials.username);
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
  // Profile
  await navBar.gotoProfilePage();
  await profilePage.isDisplayed();
  // Room List
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  // admin manage
  await navBar.gotoAdminManagePage();
  await adminManagePage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
  // Room List
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  // admin manage
  await navBar.gotoAdminManagePage();
  await adminManagePage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that Tech user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(techCredentials.username, techCredentials.password);
  await navBar.isLoggedIn(techCredentials.username);
  // default pages
  await landingPage.isDisplayedLoggedin();
  await navBar.gotoFacultyInformationPage();
  await facultyInformationPage.isDisplayed();
  await navBar.gotoClubInformationPage();
  await clubInformationPage.isDisplayed();
  // Profile
  await navBar.gotoProfilePage();
  await profilePage.isDisplayed();
  // Room List
  await navBar.gotoRoomListPage();
  await roomListPage.isDisplayed();
  // admin manage
  await navBar.gotoAdminManagePage();
  await adminManagePage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});
