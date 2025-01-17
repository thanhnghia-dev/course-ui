import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logout} from "../service/AuthService";

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("expires_at");

    // Check token immediately
    useEffect(() => {

        if (!accessToken || (expiresAt && Date.now() > parseInt(expiresAt, 10))) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("expires_at");
            navigate("/sign-in", { replace: true });
        }
    }, [navigate]);

    // Logout automotive when token is expired
    useEffect(() => {
        if (expiresAt) {
            const timeout = setTimeout(async () => {
                window.alert("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");

                await logout(accessToken);

                localStorage.removeItem("access_token");
                localStorage.removeItem("expires_at");
                navigate("/sign-in", { replace: true });
            }, parseInt(expiresAt, 10) - Date.now());

            return () => clearTimeout(timeout);
        }
    }, [navigate]);

    return localStorage.getItem("access_token") ? children : null;
};

export default PrivateRoute;
