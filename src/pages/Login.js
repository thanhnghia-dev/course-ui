import React, {useEffect, useState} from "react";
import {TabTitle} from "../utils/DynamicTitle";
import {Link, useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {login} from "../service/AuthService";
import {jwtDecode} from "jwt-decode";
import {ClipLoader} from "react-spinners";

const Login = () => {
    TabTitle('Đăng nhập');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loadingAPI, setLoadingAPI] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let [color, setColor] = useState("#ff8201");

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            navigate("/");
        }
    }, [navigate]);

    // Login to access into system
    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Vui lòng nhập tên đăng nhập hoặc mật khẩu!");
            return;
        }

        try {
            setLoadingAPI(true);

            let res = await login(username, password);

            if (res && res.message === "User login was successful") {
                const decodedToken = jwtDecode(res.access_token);
                const expiresAt = decodedToken.exp * 1000;

                localStorage.setItem("access_token", res.access_token);
                localStorage.setItem("expires_at", expiresAt);

                toast.success("Đăng nhập thành công!", {
                    onClose: () => {
                        navigate("/");
                    }
                });
            } else {
                toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi hệ thống! Vui lòng thử lại sau!");
            console.error(error);
        } finally {
            setLoadingAPI(false);
        }
    }

    return (
        <div className="bg-primary" style={{ height: "100vh" }}>
            <div className="unix-login">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="login-content">
                                <div className="login-form">
                                    <h4>Đăng nhập</h4>
                                        <div className="form-group">
                                            <label>Tên đăng nhập</label>
                                            <input type="text" className="form-control" placeholder="Tên đăng nhập" required
                                                   value={username}
                                                   onChange={(event) => {
                                                       setUsername(event.target.value);
                                                   }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Mật khẩu</label>
                                            <input type={showPassword ? "text" : "password"}
                                                   className="form-control" placeholder="Mật khẩu" required
                                                   value={password}
                                                   onChange={(event) => {
                                                       setPassword(event.target.value);
                                                   }}
                                            />
                                        </div>
                                        <div className="checkbox">
                                            <div className="pull-left">
                                                <input type="checkbox"
                                                       checked={showPassword}
                                                       onChange={() => setShowPassword(!showPassword)}
                                                />
                                                <label className="ml-2">Hiện mật khấu</label>
                                            </div>
                                            <label className="pull-right">
                                                <Link to="/reset-password">Quên mật khẩu?</Link>
                                            </label>
                                        </div>
                                        {loadingAPI && (
                                            <div className="col-md-7 text-center align-content-center">
                                                <ClipLoader
                                                    color={color}
                                                    loading={loadingAPI}
                                                    size={30}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                />
                                            </div>
                                        )}
                                        <button type="submit"
                                                className="btn btn-primary btn-flat m-b-30 m-t-30"
                                                onClick={() => handleLogin()}
                                                disabled={loadingAPI}>Đăng nhập
                                        </button>

                                        <ToastContainer
                                            position="top-right"
                                            autoClose={1000}
                                            hideProgressBar={false}
                                            newestOnTop
                                            closeOnClick={false}
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                            pauseOnHover
                                            theme="colored"
                                            transition={Bounce}
                                        />

                                        <div className="register-link m-t-15 text-center">
                                            <p>Bạn chưa có tài khoản? <Link to="/sign-up"> Đăng ký ngay</Link></p>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;