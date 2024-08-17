import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { SnackbarProvider } from 'notistack';

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
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Info from './components/Navbar/Info';

const App = () => {
  const [user, setUser] = useState(null);
  const [showMainContent, setShowMainContent] = useState(true);

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
            {/* <Navbar /> */}
            <Routes>
              {/* <Route exact path='/' element={<MainContent />} /> */}
              <Route 
                path='/login' 
                element={<Login setShowMainContent={setShowMainContent} />} 
              />
              <Route path='/info' element={<Info />} />
              <Route path='/signup' element={<Signup />} />
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
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
