import React, { useState, useReducer } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./components/Home/Home";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Info from './components/Navbar/Info';
import MainContent from './components/MainContent/MainContent';
import MyUserReducer from './Myreducer/MyUserReducer';
import cookie from "react-cookies";
import { MyDispatchContext, MyUserContext } from './configs/MyContext';
import ManageBookings from './components/Staff/ManageBookings';
import ServiceList from './components/Staff/ServiceList';
import AddService from './components/Staff/AddService';
import ManageInvoices from './components/Staff/ManageInvoices';
import { SnackbarProvider } from 'notistack';
import InvoiceList from './components/Staff/InvoiceList';

import Admin from "./components/admin/Admin"
import ExistingRooms from "./components/room/ExistingRooms"
import ExistingRoomTypes from "./components/roomtype/ExistingRoomTypes"
import ExistingEmployees from "./components/employee/ExistingEmployees"
import EditRoom from "./components/room/EditRoom"
import EditRoomType from "./components/roomtype/EditRoomType"
import EditEmployee from "./components/employee/EditEmployee"
import AddRoom from "./components/room/AddRoom"
import AddRoomType from "./components/roomtype/AddRoomType"
import AddEmployee from "./components/employee/AddEmployee"
import PaymentForm from "./components/booking/PaymentForm"

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);
  const [showMainContent, setShowMainContent] = useState(true);

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <MyUserContext.Provider value={user}>
          <MyDispatchContext.Provider value={dispatch}>
            <Navbar />
            <Routes>
              <Route exact path='/' element={<MainContent />} /> 
              <Route
                path='/login'
                element={
                  <Login
                    setShowMainContent={setShowMainContent}
                  />
                }
              />
              <Route path='/info' element={<Info />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/manage-bookings' element={<ManageBookings />} />
              <Route path="/service-list" element={<ServiceList />} />
              <Route path="/add-service" element={<AddService />} />
              <Route path="/manage-invoice" element={<ManageInvoices />} />
              <Route path="/list-invoice" element={<InvoiceList />} />

              <Route path="/payment-form" element={<PaymentForm />} />


              <Route path="/admin" element={<Admin />} />
              <Route path="/edit-room/:roomId" element={<EditRoom />} />
              <Route path="/edit-roomtype/:roomTypeId" element={<EditRoomType />} />
              <Route path="/edit-employee/:employeeId" element={<EditEmployee />} />
              <Route path="/existing-rooms" element={<ExistingRooms />} />
              <Route path="/existing-roomtypes" element={<ExistingRoomTypes />} />
              <Route path="/existing-employees" element={<ExistingEmployees />} />
              <Route path="/add-room" element={<AddRoom />} />
              <Route path="/add-roomtype" element={<AddRoomType />} />
              <Route path="/add-employee" element={<AddEmployee />} />
            </Routes>
            <Footer />
          </MyDispatchContext.Provider>
        </MyUserContext.Provider>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
