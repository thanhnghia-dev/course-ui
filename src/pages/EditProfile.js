import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import {TabTitle} from "../utils/DynamicTitle";
import {editProfile, fetchUserInfo} from "../service/UserService";
import moment from "moment";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";

const EditProfile = () => {
    TabTitle('Hồ sơ của tôi | Trung Tâm Tin Học LP');

    const [user, setUser] = useState({});

    const [fullName, setFullName] = useState('');
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [selectedImage, setSelectedImage] = useState({
        file: null,
        name: '',
        preview: ''
    });

    const [loadingAPI, setLoadingAPI] = useState(false);
    let [color, setColor] = useState("#ff8201");

    const accessToken = localStorage.getItem("access_token");

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        let res = await fetchUserInfo(accessToken);
        if (res) {
            setUser(res);
        }
    }

    // Change avatar
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage({
                file: file,
                name: file.name,
                preview: URL.createObjectURL(file)
            });
        }
    };

    // Update profile
    const handleUpdate = async () => {
        const avatar = selectedImage?.file || null;
        const formattedDob = new Date(dob).toISOString().split('.')[0];

        try {
            setLoadingAPI(true);

            let res = await editProfile(accessToken, fullName, formattedDob, gender, avatar);

            if (res) {
                toast.success("Cập nhật tài khoản thành công!", {
                    onClose: () => {
                        window.location.reload();
                    }
                });
            } else {
                toast.error("Cập nhật tài khoản thất bại!");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoadingAPI(false);
        }
    }

    useEffect(() => {
        if (user) {
            setUserId(user.userId);
            setFullName(user.fullName);
            setUsername(user.username);
            setGender(user.gender);

            if (user.dob) {
                const formattedDate = moment(user.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }
        }
    }, [user]);

    return (
        <>
            <Header/>

            <NavigationBar/>

            <div className="content-wrap">
                <div className="main">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8 p-r-0 title-margin-right">

                            </div>

                            <div className="col-lg-4 p-l-0 title-margin-left">
                                <div className="page-header">
                                    <div className="page-title">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a href="/profile">Hồ sơ cá nhân</a></li>
                                            <li className="breadcrumb-item active">
                                                <strong>Chỉnh sửa hồ sơ</strong>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <section id="main-content">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="basic-elements">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>ID</label>
                                                            <input type="text" className="form-control" value={userId}
                                                                   disabled/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Tên đăng nhập</label>
                                                            <input type="text" className="form-control" value={username}
                                                                   disabled/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Họ và tên</label>
                                                            <input type="text" className="form-control" required
                                                                   value={fullName}
                                                                   onChange={(event) => {
                                                                       setFullName(event.target.value);
                                                                   }}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Ngày sinh</label>
                                                            <input type="date" className="form-control" required
                                                                   value={dob}
                                                                   onChange={(event) => {
                                                                       setDob(event.target.value);
                                                                   }}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Giới tính</label>
                                                            <select
                                                                className="form-control select"
                                                                value={gender}
                                                                onChange={(event) => setGender(event.target.value)}>
                                                                <option value="default">---Chọn giới tính---</option>
                                                                <option value="1">Nam</option>
                                                                <option value="0">Nữ</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Ảnh đại diện</label>
                                                            <input type="file" className="form-control" accept="image/*"
                                                                   onChange={handleFileChange}
                                                            />
                                                        </div>
                                                        <div className="col-lg-4 user-photo m-b-30">
                                                            {selectedImage && (
                                                                <img src={selectedImage.preview} width="100" height="120" alt={selectedImage.name}/>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-4 form-group">
                                                            <div className="row">
                                                                {loadingAPI && (
                                                                    <div className="col-md-6">
                                                                        <ClipLoader
                                                                            color={color}
                                                                            loading={loadingAPI}
                                                                            size={40}
                                                                            aria-label="Loading Spinner"
                                                                            data-testid="loader"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="col-md-6">
                                                                    <button
                                                                        className="btn btn-primary mr-2"
                                                                        type="submit"
                                                                        onClick={handleUpdate}
                                                                        disabled={loadingAPI}>
                                                                        Lưu thay đổi
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
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