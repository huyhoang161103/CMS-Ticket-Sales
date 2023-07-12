import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Ticket from "./pages/Ticket";
import TicketComparison from "./pages/TicketComparison";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Ticketpack from "./pages/Ticketpack";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/manage-tickets" element={<Ticket />} />
      <Route path="/ticket-reconciliation" element={<TicketComparison />} />
      <Route path="/settings/service-package" element={<Ticketpack />} />
    </Routes>
  );
}

export default App;
