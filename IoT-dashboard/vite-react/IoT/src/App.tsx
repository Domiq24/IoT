import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import { isExpired } from "react-jwt";
import Navbar from './components/Navbar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Login from './components/Login.tsx'
import SignUpForm from './components/SignUpForm.tsx'
import './App.css';

function App() {

  return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path="/"  element={isExpired(localStorage.getItem('token')) ? <Navigate replace to="/login"/> : <Navigate replace to="/devices"/>} />
                <Route path="/devices" element={isExpired(localStorage.getItem('token')) ? <Navigate replace to="/login"/> : <Dashboard />} />
                <Route path="/login" element={!isExpired(localStorage.getItem('token')) ? <Navigate replace to="/devices"/> : <Login />} />
                <Route path="/sign-up" element={!isExpired(localStorage.getItem('token')) ? <Navigate replace to="/devices"/> : <SignUpForm />} />
            </Routes>
        </BrowserRouter>
  )

}

export default App
