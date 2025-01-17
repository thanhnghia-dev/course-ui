import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {fetchUserInfo} from "../service/UserService";
import {logout} from "../service/AuthService";

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const accessToken = localStorage.getItem("access_token");

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location.pathname]);

    const getUserInfo = async () => {
        let res = await fetchUserInfo(accessToken);
        if (res) {
            setShow(res.role === "ADMIN");
        }
    };

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        if (!accessToken) {
            return navigate("/sign-in");
        }

        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (!confirmLogout) {
            return;
        }

        try {
            await logout(accessToken);
            localStorage.removeItem("access_token");
            localStorage.removeItem("expires_at");
            navigate("/sign-in");
        } catch (error) {
            console.error("Đăng xuất thất bại:", error.response?.data || error.message);
            alert("Đăng xuất thất bại!");
        }
    };


    return (
        <div className="sidebar sidebar-hide-to-small sidebar-shrink sidebar-gestures">
            <div className="nano">
                <div className="nano-content">
                    <ul>
                        <div className="logo">
                            <Link to="/">
                                <img src="./LP-logo.png" alt="LP-logo" width={40} height={40} />
                                <span> Tin học LP</span>
                            </Link>
                        </div>

                        <li className="label">Chính</li>
                        <li className={`${activeMenu === "/" ? "active" : ""}`}>
                            <Link to="/">
                                <i className="ti-blackboard"></i> Thống kê
                            </Link>
                        </li>

                        <li className="label">Quản lý</li>
                        {show && (
                            <li className={`${activeMenu === "/users" ? "active" : ""}`}>
                                <Link to="/users">
                                    <i className="ti-user"></i> Người dùng
                                </Link>
                            </li>
                        )}
                        <li className={`${activeMenu === "/courses" ? "active" : ""}`}>
                            <Link to="/courses">
                                <i className="ti-layout-grid2-alt"></i> Khóa học
                            </Link>
                        </li>
                        <li className={`${activeMenu === "/classes" ? "active" : ""}`}>
                            <Link to="/classes">
                                <i className="ti-home"></i> Lớp học
                            </Link>
                        </li>
                        <li className={`${activeMenu === "/students" ? "active" : ""}`}>
                            <Link to="/students">
                                <i className="ti-user"></i> Học viên
                            </Link>
                        </li>

                        <li className="label">Khác</li>
                        <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a>
                                <i className="ti-power-off"></i> Đăng xuất
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;