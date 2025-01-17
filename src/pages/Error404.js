import React from "react";
import {Link} from "react-router-dom";

const Error404 = () => {
    return (
        <div className="content-wrap">
            <div className="main">
                <div className="account-page">
                    <div className="container">
                        <div className="error-box text-center">
                            <h1>404</h1>
                            <h3><i className="ti-face-sad"></i> Oops! Trang không tồn tại!</h3>
                            <p>Trang bạn yêu cầu hiện không tồn tại hoặc không truy cập được.</p>
                            <Link to="/" class="btn btn-primary go-home">Về trang chủ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Error404;