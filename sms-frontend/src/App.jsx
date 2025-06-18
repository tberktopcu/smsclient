import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import SmsManager from "./SmsManager";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/sms-manager" element={<SmsManager />} />
      </Routes>
    </Router>
  );
}
