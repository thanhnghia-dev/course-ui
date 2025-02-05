import React, {useState} from "react";
import {TabTitle} from "../utils/DynamicTitle";
import {Link, useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {register} from "../service/AuthService";
import {ClipLoader} from "react-spinners";

const Register = () => {
    TabTitle('Đăng ký tài khoản');

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loadingAPI, setLoadingAPI] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let [color, setColor] = useState("#ff8201");

    function handlePasswordChange(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);
        if (!validatePassword(newPassword)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường, ' +
                'một chữ cái viết hoa, một ký tự đặc biệt và có ít nhất 8 ký tự.');
        } else {
            setPasswordError('');
        }
    }

    function handleConfPasswordChange(event) {
        const newConfPassword = event.target.value;
        setConfPassword(newConfPassword);
        if (newConfPassword !== password) {
            setConfPasswordError('Mật khẩu xác nhận không khớp.');
        } else {
            setConfPasswordError('');
        }
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // Sign in account
    const handleRegister = async () => {
        if (!fullName || !username || !password || !confPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            setLoadingAPI(true);

            let res = await register(fullName, username, password, 2, "USER");

            if (res && res.message === "User registration was successful") {
                toast.success("Đăng ký thành công!", {
                    onClose: () => {
                        navigate("/sign-in");
                    }
                });
            } else {
                toast.error("Tên đăng nhập đã tồn tại!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi hệ thống! Vui lòng thử lại sau!");
            console.error(error);
        } finally {
            setLoadingAPI(false);
        }
    };

    return (
        <div className="bg-primary">
            <div className="unix-login">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="login-content">
                                <div className="login-form">
                                    <h4>Đăng ký tài khoản</h4>
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input type="text" className="form-control" placeholder="Họ và tên" required
                                                   value={fullName}
                                                   onChange={(event) => {
                                                       setFullName(event.target.value);
                                                   }}
                                            />
                                        </div>
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
                                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Mật khẩu" required
                                                   value={password}
                                                   onChange={handlePasswordChange}
                                            />
                                            {passwordError && <div className="mt-2" style={{ color: 'red' }}>{passwordError}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Xác nhận mật khẩu</label>
                                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Xác nhận mật khẩu" required
                                                   value={confPassword}
                                                   onChange={handleConfPasswordChange}
                                            />
                                            {confPasswordError && <div className="mt-2" style={{ color: 'red' }}>{confPasswordError}</div>}
                                        </div>
                                        <div className="checkbox">
                                            <div className="pull-left">
                                                <input type="checkbox"
                                                   checked={showPassword}
                                                   onChange={() => setShowPassword(!showPassword)}
                                                />
                                                <label className="ml-2">Hiện mật khấu</label>
                                            </div>
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
                                                onClick={() => handleRegister()}
                                                disabled={loadingAPI}>Đăng ký
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
                                            <p>Bạn đã có tài khoản? <Link to="/sign-in"> Đăng nhập</Link></p>
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

export default Register;