import React, {useEffect, useState} from "react";
import Header from "../components/NavigationBar";
import NavigationBar from "../components/Header";
import {TabTitle} from "../utils/DynamicTitle";
import Footer from "../components/Footer";
import DataTable from "react-data-table-component";
import {Link} from "react-router-dom";
import * as XLSX from 'xlsx';
import {deleteUser, fetchAllUsers, updateUser} from "../service/UserService";
import moment from "moment";
import {Bounce, toast, ToastContainer} from "react-toastify";

const Users = () => {
    TabTitle('Quản lý Người dùng | Trung Tâm Tin Học LP');

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [id, setId] = useState('');
    const [userId, setUserId] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    const accessToken = localStorage.getItem("access_token");

    const getUsers = async () => {
        let res = await fetchAllUsers(accessToken);
        if (res) {
            setUsers(res);
        }
    }

    const actionButton = (id) => {
        const user = users.find((user) => user.id === id);

        if (user) {
            setId(user.id);
            setUserId(user.userId);
            setFullName(user.fullName);
            setUsername(user.username);
            setGender(user.gender);
            setRole(user.role);
            setStatus(user.status);

            if (user.dob) {
                const formattedDate = moment(user.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }
        } else {
            console.error("Course not found");
        }
    };

    // Update a user
    const handleUpdate = async () => {
        const formattedDob = new Date(dob).toISOString().split('.')[0];

        let res = await updateUser(accessToken, id, fullName, formattedDob, gender, role, status);

        if (res && id) {
            toast.success("Cập nhật thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Cập nhật thất bại!");
        }
    }

    // Delete a user
    const confirmDelete = async () => {
        let res = await deleteUser(accessToken, id);

        if (res && id) {
            toast.success("Xóa thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa thất bại!");
        }
    }

    // Export file to Excel
    const handleOnExport = () => {
        const formattedData = users.map((row, index) => ({
            Stt: index + 1,
            "ID": row.userId,
            "Họ và tên": row.fullName,
            "Ngày sinh": convertDate({ date: row.dob }),
            "G.tính": getGender(row),
            "Vai trò": getRole(row),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);

        XLSX.utils.book_append_sheet(wb, ws, "Nguoi Dung");

        XLSX.writeFile(wb, "Danh_sach_nguoi_dung.xlsx");
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getGender = ({gender}) => {
        if (gender === 1) {
            return "Nam";
        } else {
            return "Nữ";
        }
    };

    const getRole = ({role}) => {
        if (role === "ADMIN") {
            return 'Admin';
        } else {
            return 'Giảng viên';
        }
    };

    const getStatus = (item) => {
        if (item.status === 1) {
            return <span className="badge badge-success" style={{ padding: '5px' }}>Đang hoạt động</span>;
        } else {
            return <span className="badge badge-danger" style={{ padding: '5px' }}>Ngừng hoạt động</span>;
        }
    };

    const renderImage = (image, name) => {
        if (image && image.url) {
            return (
                <div className="mt-2 mb-2">
                    <img
                        src={image.url}
                        alt={name}
                        style={{
                            maxWidth: '50px',
                            maxHeight: '70px'
                        }}
                    />
                </div>
            );
        }
        return <span></span>;
    };

    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
        },
        {
            name: "Mã Người dùng",
            selector: (row) => row.userId,
            wrap: true,
            width: "130px",
        },
        {
            name: "Ảnh đại diện",
            selector: (row) => renderImage(row.image, row.name),
            wrap: true,
            width: "120px",
        },
        {
            name: "Họ và tên",
            selector: (row) => row.fullName,
            wrap: true,
            width: "200px",
        },
        {
            name: "Tên đăng nhập",
            selector: (row) => row.username,
            wrap: true,
            width: "120px",
        },
        {
            name: "Ngày sinh",
            selector: (row) => row.dob ? convertDate({ date: row.dob }) : "",
        },
        {
            name: "Giới tính",
            selector: (row) => getGender({ gender: row.gender }),
        },
        {
            name: "Vai trò",
            selector: (row) => getRole({ role: row.role }),
        },
        {
            name: "Trạng thái",
            selector: (row) => getStatus(row),
            wrap: true,
            width: "150px",
        },
        {
            name: "Chức năng",
            cell: (row) =>
                <div>
                    <button type="submit" data-toggle="modal"
                            data-target="#edit_user"
                            className="btn-primary mb-1"
                            onClick={() => actionButton(row.id)}>
                        <i className="ti-pencil" title="Sửa"></i>
                    </button>
                    <button type="submit" data-toggle="modal"
                            data-target="#delete_user"
                            className="btn-danger mb-1"
                            style={{marginLeft: '5px'}}
                            onClick={() => actionButton(row.id)}>
                        <i className="ti-trash" title="Xóa"></i>
                    </button>
                </div>,
        },
    ];


    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                color: '#000',
            },
        },
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredUsers(users);
            return;
        }

        const result = users.filter(user => {
            return user.fullName?.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredUsers(result);
    }, [search, users]);

    return (
        <>
            <Header/>

            <NavigationBar/>

            <div className="content-wrap">
                <div className="main">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8 p-r-0 title-margin-right">
                                <div className="page-header">
                                    <div className="page-title">
                                        <h1 style={{fontWeight: "bold", fontSize: "25px"}}>QUẢN LÝ NGƯỜI DÙNG</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 p-l-0 title-margin-left">
                                <div className="page-header">
                                    <div className="page-title">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                            <li className="breadcrumb-item active">
                                                <strong>Người dùng</strong>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <section id="main-content" style={{ height: "100vh" }}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <DataTable
                                            title="Danh sách Người dùng"
                                            columns={columns}
                                            data={filteredUsers}
                                            customStyles={customStyles}
                                            pagination
                                            fixedHeader
                                            fixedHeaderScrollHeight="400px"
                                            highlightOnHover
                                            actions={<button className="btn btn-success"
                                                             onClick={handleOnExport}>Xuất File Excel</button>}
                                            subHeader
                                            subHeaderAlign="left"
                                            subHeaderComponent={
                                                <input
                                                    type="text"
                                                    placeholder="Nhập họ tên người dùng"
                                                    className="w-30 form-control"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            }
                                            noDataComponent={<div>Không có dữ liệu để hiển thị</div>}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div id="edit_user" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Chỉnh sửa người dùng</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Họ và tên</label>
                                                    <input type="text" className="form-control" required
                                                           value={fullName}
                                                           onChange={(event) => {
                                                               setFullName(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Tên đăng nhập</label>
                                                    <input type="text" className="form-control" disabled
                                                           value={username}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày sinh</label>
                                                    <input type="date" className="form-control" required="required"
                                                           value={dob}
                                                           onChange={(event) => {
                                                               setDob(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Giới tính</label>
                                                    <select
                                                        className="form-control select"
                                                        value={gender}
                                                        onChange={(event) => setGender(event.target.value)}>
                                                        <option value="default">---Chọn giới tính---</option>
                                                        <option value={1}>Nam</option>
                                                        <option value={0}>Nữ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Vai trò</label>
                                                    <select
                                                        className="form-control select"
                                                        value={role}
                                                        onChange={(event) => setRole(event.target.value)}>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="USER">Giảng viên</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Trạng thái</label>
                                                    <select
                                                        className="form-control select"
                                                        value={status}
                                                        onChange={(event) => setStatus(event.target.value)}>
                                                        <option value={1}>Đang hoạt động</option>
                                                        <option value={0}>Ngừng hoạt động</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="m-t-20 text-center">
                                            <button className="btn btn-primary btn-lg" data-dismiss="modal"
                                                    onClick={() => handleUpdate()}>Lưu thay đổi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="delete_user" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-md">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Xóa người dùng</h4>
                                    </div>
                                    <div className="modal-body">
                                        <p>Bạn có chắc muốn xóa người dùng này?</p>
                                        <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                                      data-dismiss="modal">Hủy</Link>
                                            <button type="submit" className="btn btn-danger" data-dismiss="modal"
                                                    style={{marginLeft: '10px'}}
                                                    onClick={() => confirmDelete()}>Xóa
                                            </button>
                                        </div>
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

export default Users;