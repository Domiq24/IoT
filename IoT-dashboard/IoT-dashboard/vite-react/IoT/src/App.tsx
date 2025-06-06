import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import './App.css'
import { isExpired } from "react-jwt";
import Navbar from "./components/Navbar.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route path="device" element={<Dashboard />}/>
                </Route>
            </Routes>
        </BrowserRouter>

    </>
  )

}

export default App
