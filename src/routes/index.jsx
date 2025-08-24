import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Countries from "../pages/Countries";
import Wonders from "../pages/Wonders";
import Feedback from "../pages/Feedback";
import Login from "../pages/Login";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Spin } from "antd";

const AppRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user);
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("adminToken", token); // store token
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

    if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin size="default"/>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      {!isAuthenticated && <Route path="/login" element={<Login />} />}

      {/* Private Routes */}
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/wonders" element={<Wonders />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
