import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Tasks from "@/components/pages/Tasks";
import Users from "@/components/pages/Users";

function App() {
  const [currentUser] = useState({
    Id: 1,
    name: "John Admin",
    email: "admin@taskflow.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar currentUser={currentUser} />
        <main className="flex-1 lg:ml-0 p-6 lg:p-8 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/projects" element={<Projects currentUser={currentUser} />} />
            <Route path="/projects/:id" element={<ProjectDetail currentUser={currentUser} />} />
            <Route path="/tasks" element={<Tasks currentUser={currentUser} />} />
            <Route path="/users" element={<Users currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;