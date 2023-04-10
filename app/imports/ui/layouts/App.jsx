import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import FacultyInfo from '../pages/FacultyInfo';
import NotAuthorized from '../pages/NotAuthorized';
import AdminReservation from '../pages/AdminReservation';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import RoomList from '../pages/RoomList';
import { ROLE } from '../../api/role/Role';
import StudentRequests from '../pages/StudentRequests';
import FacultyRequests from '../pages/FacultyRequests';
import RequestRoomForm from '../pages/RequestRoomForm';
import AddReservation from '../pages/AddReservation';
import AdminManage from '../pages/AdminManage';
import ClubInfo from '../pages/ClubInfo';
import LoadingSpinner from '../components/LoadingSpinner';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  console.log(`App Roles ${ready}`);
  const [overlay, setOverlay] = useState(false);
  const changeOverlay = () => setOverlay(!overlay);
  const [highlight, setHighlight] = useState('');
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => {
    setCounter(counter + 1);
    if (counter >= 5) {
      setCounter(0);
    }
  };
  const decrementCounter = () => {
    setCounter(counter - 1);
    if (counter < 1) {
      setCounter(0);
    }
  };
  const changeHighlight = () => { setHighlight('hole rounded'); };
  const resetCounter = () => setCounter(0);
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar overlay={overlay} changeOverlay={changeOverlay} highlight={highlight} changeHighlight={changeHighlight} counter={counter} incrementCounter={incrementCounter} decrementCounter={decrementCounter} resetCounter={resetCounter} />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/faculty" element={<FacultyInfo />} />
          <Route path="/club" element={<ClubInfo />} />
          <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/profile/:_id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile/:_id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/roomlist" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
          <Route path="/reservation" element={<ProtectedRoute><AdminReservation /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute><AdminManage /></ProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/studentrequests" element={<ProtectedRoute><StudentRequests /></ProtectedRoute>} />
          <Route path="/facultyrequests" element={<ProtectedRoute><FacultyRequests /></ProtectedRoute>} />
          <Route path="/requestroomform" element={<ProtectedRoute><RequestRoomForm /></ProtectedRoute>} />
          <Route path="/addReservation" element={<ProtectedRoute><AddReservation /></ProtectedRoute>} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  console.log('ProtectedRoute', isLogged);
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  console.log('AdminProtectedRoute', isLogged, isAdmin);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
