import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Footer from "./Footer";
import DataTable from "react-data-table-component";
import {fetchAllClasses} from "../service/ClassService";
import moment from "moment/moment";
import {fetchAllStudents} from "../service/StudentService";
import {fetchAllCourses} from "../service/CourseService";
import {fetchAllUsers, fetchUserInfo} from "../service/UserService";

const Statistical = () => {

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [show, setShow] = useState(false);

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalClasses, setTotalClasses] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const reversedStudents = students.slice(-5).reverse();
    const reversedClasses = classes.slice(-5).reverse();

    const accessToken = localStorage.getItem("access_token");

    const getCourses = async () => {
        let res = await fetchAllCourses();
        if (res) {
            setTotalCourses(res.length);
        }
    }

    const getClasses = async () => {
        let res = await fetchAllClasses();
        if (res) {
            setClasses(res);
            setTotalClasses(res.length);
        }
    }

    const getUserInfo = async () => {
        let res = await fetchUserInfo(accessToken);
        if (res) {
            setShow(res.role === "ADMIN");
        }
    }

    const getUsers = async () => {
        let res = await fetchAllUsers(accessToken);
        if (res) {
            setTotalUsers(res.length);
        }
    }

    const getStudents = async () => {
        let res = await fetchAllStudents();
        if (res) {
            setStudents(res);
            setTotalStudents(res.length);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getGender = ({gender}) => {
        if (gender === 1) {
            return "Nam";
        } else if (gender === 0) {
            return "Nữ";
        } else {
            return "Khác";
        }
    };

    const getStudentStatus = (item) => {
        if (item.status === 1) {
            return <span className="badge badge-warning" style={{ padding: '5px' }}>Đang học</span>;
        } else if (item.status === 2) {
            return <span className="badge badge-success" style={{ padding: '5px' }}>Hoàn thành</span>;
        } else {
            return <span className="badge badge-danger" style={{ padding: '5px' }}>Nghỉ học ngang</span>;
        }
    };

    const getClassStatus = (item) => {
        if (item.status === 1) {
            return <span className="badge badge-success" style={{ padding: '5px' }}>Đang diễn ra</span>;
        } else {
            return <span className="badge badge-danger" style={{ padding: '5px' }}>Kết thúc</span>;
        }
    };

    const studentColumns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
        },
        {
            name: "Mã Học viên",
            selector: (row) => row.studentId,
            wrap: true,
            width: "120px",
        },
        {
            name: "Họ, tên lót",
            selector: (row) => row.lastName,
            wrap: true,
            width: "200px",
        },
        {
            name: "Tên",
            selector: (row) => row.firstName,
        },
        {
            name: "Ngày sinh",
            selector: (row) => row.dob ? convertDate({ date: row.dob }) : "",
        },
        {
            name: "Nơi sinh",
            selector: (row) => row.birthPlace ? row.birthPlace : "",
            wrap: true,
            width: "150px",
        },
        {
            name: "Giới tính",
            selector: (row) => getGender({ gender: row.gender }),
        },
        {
            name: "Điện thoại",
            selector: (row) => row.phoneNumber,
            wrap: true,
            width: "110px",
        },
        {
            name: "Trạng thái",
            selector: (row) => getStudentStatus(row),
            wrap: true,
            width: "150px",
        },
    ];

    const classColumns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
        },
        {
            name: "Mã Lớp học",
            selector: (row) => row.classId,
        },
        {
            name: "Tên Lớp học",
            selector: (row) => row.name,
            wrap: true,
            width: "150px",
        },
        {
            name: "Ngày Khai giảng",
            selector: (row) => convertDate({ date: row.startDate }),
            wrap: true,
            width: "150px",
        },
        {
            name: "Ngày Kết thúc",
            selector: (row) => convertDate({ date: row.endDate }),
        },
        {
            name: "Ngày Thi",
            selector: (row) => convertDate({ date: row.examDate }),
        },
        {
            name: "Trạng thái",
            cell: (row) => getClassStatus(row),
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
        getClasses();
        getCourses();
        getUsers()
        getUserInfo();
        getStudents();
    }, []);

    return (
        <div className="content-wrap">
            <div className="main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8 p-r-0 title-margin-right">
                            <div className="page-header">
                                <div className="page-title">
                                    <h1 style={{fontWeight: "bold", fontSize: "25px"}}>THỐNG KÊ</h1>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 p-l-0 title-margin-left">
                            <div className="page-header">
                                <div className="page-title">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                        <li className="breadcrumb-item active">
                                            <strong>Thống kê</strong>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                    </div>

                    <section id="main-content">
                        <div className="row">
                            {show && (
                                <div className="col-lg-3">
                                    <Link to="/users">
                                        <div className="card">
                                            <div className="stat-widget-one">
                                                <div className="stat-icon dib"><i
                                                    className="ti-user color-success border-success"></i>
                                                </div>
                                                <div className="stat-content dib">
                                                    <div className="stat-text">Người dùng</div>
                                                    <div className="stat-digit">{totalUsers}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <div className="col-lg-3">
                                <Link to="/courses">
                                    <div className="card">
                                        <div className="stat-widget-one">
                                            <div className="stat-icon dib"><i
                                                className="ti-layout-grid2 color-primary border-primary"></i>
                                            </div>
                                            <div className="stat-content dib">
                                                <div className="stat-text">Khóa học</div>
                                                <div className="stat-digit">{totalCourses}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-lg-3">
                                <Link to="/classes">
                                    <div className="card">
                                        <div className="stat-widget-one">
                                            <div className="stat-icon dib"><i
                                                className="ti-home color-warning border-warning"></i>
                                            </div>
                                            <div className="stat-content dib">
                                                <div className="stat-text">Lớp học</div>
                                                <div className="stat-digit">{totalClasses}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-lg-3">
                                <Link to="/students">
                                    <div className="card">
                                        <div className="stat-widget-one">
                                            <div className="stat-icon dib"><i
                                                className="ti-user color-pink border-pink"></i>
                                            </div>
                                            <div className="stat-content dib">
                                                <div className="stat-text">Học viên</div>
                                                <div className="stat-digit">{totalStudents}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="card">
                                <DataTable
                                    title="Học viên gần đây"
                                    columns={studentColumns}
                                    data={reversedStudents}
                                    customStyles={customStyles}
                                    fixedHeader
                                    fixedHeaderScrollHeight="400px"
                                    highlightOnHover
                                    noDataComponent={<div>Không có dữ liệu để hiển thị</div>}
                                />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="card">
                                <DataTable
                                    title="Lớp học gần đây"
                                    columns={classColumns}
                                    data={reversedClasses}
                                    customStyles={customStyles}
                                    fixedHeader
                                    fixedHeaderScrollHeight="400px"
                                    highlightOnHover
                                    noDataComponent={<div>Không có dữ liệu để hiển thị</div>}
                                />
                            </div>
                        </div>

                    </section>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Statistical;