import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {fetchUserInfo} from "../service/UserService";

const Header = () => {
    const [user, setUser] = useState({});

    const accessToken = localStorage.getItem("access_token");

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserInfo = async () => {
        let res = await fetchUserInfo(accessToken);
        if (res) {
            setUser(res);
        }
    }

    return (
        <div className="header">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="float-left header-heading">
                            <h2 className="text-capitalize">Trung tâm tin học LP</h2>
                        </div>
                        <div className="float-right">
                            <Link to="/profile">
                                <div className="header-icon">
                                    {user.image ? (
                                        <img className="rounded-circle" src={user.image.url} alt={user.name} width={30}/>
                                    ) : (
                                        <img className="rounded-circle" src="./assets/images/user.jpg" alt={user.name} width={30}/>
                                    )}
                                    <span className="user-avatar" style={{marginLeft: '10px'}}>{user.fullName}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;