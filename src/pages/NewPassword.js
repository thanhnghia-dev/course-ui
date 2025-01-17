import React, {useState} from "react";
import {TabTitle} from "../utils/DynamicTitle";
import {useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify"
import {resetPassword} from "../service/UserService";

const NewPassword = () => {
    TabTitle('Đặt lại mật khẩu');

    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const username = localStorage.getItem("username");

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

    // Save change
    const handleSaveChange = async () => {
        if (!password || !confPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            let res = await resetPassword(username, password);

            if (res) {
                toast.success("Tạo mật khẩu mới thành công!", {
                    onClose: () => {
                        localStorage.removeItem("username");
                        navigate("/sign-in");
                    }
                });
            } else {
                toast.error("Tạo mật khẩu thất bại!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi hệ thống! Vui lòng thử lại sau!");
            console.error(error);
        }
    };

    return (
        <div className="bg-primary" style={{ height: "100vh" }}>
            <div className="unix-login">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="login-content">
                                <div className="login-form">
                                    <h4>Tạo mật khẩu mới</h4>
                                        <div className="form-group">
                                            <label>Mật khẩu mới</label>
                                            <input type={showPassword ? "text" : "password"}
                                                   className="form-control" placeholder="Mật khẩu mới" required
                                                   value={password}
                                                   onChange={handlePasswordChange}
                                            />
                                            {passwordError && <div className="mt-2" style={{ color: 'red' }}>{passwordError}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Xác nhận mật khẩu</label>
                                            <input type={showPassword ? "text" : "password"}
                                                   className="form-control" placeholder="Xác nhận mật khẩu" required
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
                                        <button type="submit"
                                                className="btn btn-primary btn-flat m-b-30 m-t-30"
                                                onClick={() => handleSaveChange()}>Lưu thay đổi</button>

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPassword;