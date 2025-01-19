import React, {useState} from "react";
import {TabTitle} from "../utils/DynamicTitle";
import {Link, useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {checkExistUsername} from "../service/UserService";

const ResetPassword = () => {
    TabTitle('Đặt lại mật khẩu');

    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    // Send data
    const handleSend = async () => {
        if (!username) {
            toast.error("Vui lòng nhập tên đăng nhập!");
            return;
        }

        try {
            let res = await checkExistUsername(username);

            if (res === true) {
                localStorage.setItem("username", username);

                toast.success("Đang chuyển đến trang Tạo mật khẩu mới!", {
                    onClose: () => {
                        navigate("/new-password");
                    }
                });
            } else {
                toast.error("Tên đăng nhập không tồn tại!");
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
                                    <h4>Đặt lại mật khẩu</h4>
                                    <div className="form-group">
                                        <label>Tên đăng nhập</label>
                                        <input type="text" className="form-control" placeholder="Tên đăng nhập" required
                                               value={username}
                                               onChange={(event) => {
                                                   setUsername(event.target.value);
                                               }}
                                        />
                                    </div>
                                    <button type="submit"
                                            className="btn btn-primary btn-flat m-b-15"
                                            onClick={handleSend}>Xác nhận
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

                                    <div className="register-link text-center">
                                        <p>Trở lại trang <Link to="/sign-in">Đăng nhập</Link></p>
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

export default ResetPassword;