import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import {TabTitle} from "../utils/DynamicTitle";
import {Link} from "react-router-dom";
import {fetchUserInfo} from "../service/UserService";
import moment from "moment";

const Profile = () => {
    TabTitle('Hồ sơ của tôi | Trung Tâm Tin Học LP');

    const [user, setUser] = useState({});

    const accessToken = localStorage.getItem("access_token");

    const getUserInfo = async () => {
        let res = await fetchUserInfo(accessToken);
        if (res) {
            setUser(res);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getRole = ({role}) => {
        if (role === "ADMIN") {
            return 'Quản trị viên';
        } else {
            return 'Giảng viên';
        }
    }

    const getGender = ({gender}) => {
        if (gender === 1) {
            return 'Nam';
        } else {
            return 'Nữ';
        }
    }

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                            <li className="breadcrumb-item">
                                                <a href="/">Trang chủ</a>
                                            </li>
                                            <li className="breadcrumb-item active">
                                                <strong>Hồ sơ cá nhân</strong>
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
                                            <div className="user-profile">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <div className="user-photo m-b-30">
                                                            {user.image ? (
                                                                <img src={user.image.url} alt={user.name} width={300} height={350}/>
                                                            ) : (
                                                                <img src="./assets/images/user.jpg" alt={user.name} width={300} height={350}/>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <div className="user-profile-name"><strong>{user.fullName}</strong></div>
                                                        <div className="user-job-title">{getRole({role: user.role})}</div>
                                                        <div className="custom-tab user-profile-tab">
                                                            <ul className="nav nav-tabs" role="tablist">
                                                                <li role="presentation" className="active">
                                                                    <span aria-controls="1" role="tab" data-toggle="tab">Thông tin cá nhân</span>
                                                                </li>
                                                            </ul>
                                                            <div className="tab-content">
                                                                <div role="tabpanel" className="tab-pane active" id="1">
                                                                    <div className="contact-information">
                                                                        <div className="id-content">
                                                                            <span className="contact-title">ID:</span>
                                                                            <span className="phone-number">{user.userId}</span>
                                                                        </div>
                                                                        <div className="username-content">
                                                                            <span className="contact-title">Tên đăng nhập:</span>
                                                                            <span className="mail-address">{user.username}</span>
                                                                        </div>
                                                                        <div className="birthday-content">
                                                                            <span className="contact-title">Ngày sinh:</span>
                                                                            <span className="birth-date">{user.dob ? convertDate({ date: user.dob }) : "Trống"}</span>
                                                                        </div>
                                                                        <div className="gender-content">
                                                                            <span className="contact-title">Giới tính:</span>
                                                                            <span className="gender">{getGender({gender: user.gender})}</span>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <Link to="/edit-profile">
                                                                                    <div className="user-send-message">
                                                                                        <button className="btn btn-primary btn-addon" type="button">
                                                                                            <i className="ti-marker-alt"></i> Chỉnh sửa hồ sơ
                                                                                        </button>
                                                                                    </div>
                                                                                </Link>
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <Link to="/change-password">
                                                                                    <div className="user-send-message">
                                                                                        <button className="btn btn-secondary btn-addon" type="button">
                                                                                            <i className="ti-lock"></i> Đổi mật khẩu
                                                                                        </button>
                                                                                    </div>
                                                                                </Link>
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
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <Footer/>
            </div>
        </>
    );
}

export default Profile;