import React, {useState} from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import {TabTitle} from "../utils/DynamicTitle";
import {useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {changePassword} from "../service/UserService";

const EditProfile = () => {
    TabTitle('Đổi mật khẩu | Trung Tâm Tin Học LP');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("access_token");

    function handlePasswordChange(event) {
        const password = event.target.value;
        setNewPassword(password);
        if (!validatePassword(password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một ký tự đặc biệt và có ít nhất 8 ký tự.');
        } else if (password === currentPassword) {
            setPasswordError('Mật khẩu mới không được trùng mật khẩu cũ.');
        } else {
            setPasswordError('');
        }
    }

    function handleConfPasswordChange(event) {
        const newConfPassword = event.target.value;
        setConfPassword(newConfPassword);
        if (newConfPassword !== newPassword) {
            setConfPasswordError('Mật khẩu xác nhận không khớp.');
        } else {
            setConfPasswordError('');
        }
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // Save changes
    const handleSaveChange = async () => {
        if (!currentPassword || !newPassword || !confPassword) {
            toast.warning("Vui lòng nhập mật khẩu!");
            return;
        }

        let res = await changePassword(accessToken, newPassword);

        if (res) {
            toast.success("Đổi mật khẩu thành công!", {
                onClose: () => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("expires_at");
                    navigate("/sign-in");
                }
            });
        } else {
            toast.error("Đổi mật khẩu thất bại!");
        }
    }
    return (
        <>
            <Header/>

            <NavigationBar/>

            <div className="content-wrap">
                <div className="main">
                    <div className="container-fluid">
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <div className="col-lg-6">
                                <div className="login-content">
                                    <div className="login-form">
                                        <h4 className="text-capitalize">Đổi mật khẩu</h4>
                                            <div className="form-group">
                                                <label>Mật khẩu hiện tại</label>
                                                <input type={showPassword ? "text" : "password"}
                                                       className="form-control" placeholder="Mật khẩu hiện tại" required
                                                       value={currentPassword}
                                                       onChange={(event) => {
                                                           setCurrentPassword(event.target.value);
                                                       }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Mật khẩu mới</label>
                                                <input type={showPassword ? "text" : "password"}
                                                       className="form-control" placeholder="Mật khẩu mới" required
                                                       value={newPassword}
                                                       onChange={handlePasswordChange}
                                                />
                                                {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Xác nhận mật khẩu</label>
                                                <input type={showPassword ? "text" : "password"}
                                                       className="form-control" placeholder="Xác nhận mật khẩu" required
                                                       value={confPassword}
                                                       onChange={handleConfPasswordChange}
                                                />
                                                {confPasswordError && <div style={{ color: 'red' }}>{confPasswordError}</div>}
                                            </div>
                                            <div className="checkbox">
                                                <div className="pull-left">
                                                    <input type="checkbox"
                                                       checked={showPassword}
                                                       onChange={() => setShowPassword(!showPassword)}
                                                    />
                                                <label className="ml-2">Hiện mật khẩu</label>
                                                </div>
                                            </div>
                                            <button type="submit"
                                                    className="btn btn-primary btn-flat m-b-30 m-t-10"
                                                    onClick={() => handleSaveChange()}>
                                                Lưu thay đổi
                                            </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Footer/>
            </div>

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
        </>
    );
}

export default EditProfile;