import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ChangePassword from "../pages/ChangePassword";
import Users from "../pages/Users";
import Courses from "../pages/Courses";
import Classes from "../pages/Classes";
import Students from "../pages/Students";
import PrivateRoute from "./PrivateRoute";
import NewPassword from "../pages/NewPassword";
import Error404 from "../pages/Error404";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sign-in" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/error-404" element={<Error404/>}/>

            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
            <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        </Routes>
    );
}

export default AppRoutes;