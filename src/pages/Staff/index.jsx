import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StaffList from "./StaffList";
import AddEditStaff from "./AddEditStaff";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/staffList" />} />
      <Route path="/staffList" element={<StaffList />} />
      <Route path="/staff/add" element={<AddEditStaff />} />
      <Route path="/staff/edit/:id" element={<AddEditStaff />} />
    </Routes>
  );
};

export default StaffRoutes;
