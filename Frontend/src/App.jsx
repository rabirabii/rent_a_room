import { useState } from "react";

import "./App.css";
import Navbar from "./components/Layout/Navbar";
import { Route, Routes } from "react-router-dom";
import Layout from "./Pages/Layout";
import Homepage from "./Pages/Homepage";

import Auth from "./Pages/Auth/Auth";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/register" element={<Auth isLogin={false} />} />
      </Routes>
    </>
  );
}

export default App;
