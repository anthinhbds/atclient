import React, { useEffect } from "react";

// import {
//   Box,
// } from "@mui/material";
import { getAuthToken } from 'utils'
import { MainPage, LoginPage } from 'pages';
import { Route, Routes, useNavigate } from "react-router-dom";


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      navigate('/login');
    }
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>

  )
}

export default App;