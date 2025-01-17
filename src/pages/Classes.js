import React, {useEffect, useState} from "react";
import Header from "../components/NavigationBar";
import NavigationBar from "../components/Header";
import {TabTitle} from "../utils/DynamicTitle";
import Footer from "../components/Footer";
import DataTable from "react-data-table-component";
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";
import {createClasses, deleteClass, fetchAllClasses, updateClass} from "../service/ClassService";
import moment from "moment";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {fetchAllCourses} from "../service/CourseService";

const Classes = () => {
    TabTitle('Quản lý Lớp học | Trung Tâm Tin Học LP');

    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);

    const [id, setId] = useState('');
    const [classId, setClassId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [name, setName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [reversedClasses, setReversedClasses] = useState([]);

    useEffect(() => {
        setReversedClasses([...classes].reverse());
    }, [classes]);

    const getClasses = async () => {
        let res = await fetchAllClasses();
        if (res) {
            setClasses(res);
        }
    }

    const getCourses = async () => {
        let res = await fetchAllCourses();
        if (res) {
            setCourses(res);
        }
    }

    // Save a new course
    const handleSave = async () => {
        if (!courseId || !classId || !name || !startDate || !endDate || !examDate) {
            toast.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const formattedStartDate = new Date(startDate).toISOString().split('.')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('.')[0];
        const formattedExamDate = new Date(examDate).toISOString().split('.')[0];

        let res = await createClasses(courseId, classId, name, formattedStartDate, formattedEndDate, formattedExamDate);

        if (res && res.id) {
            setClassId('');
            setName('');
            setStartDate('');
            setEndDate('');
            setExamDate('');
            setCourseId('');

            toast.success("Tạo lớp học thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Tạo lớp học thất bại!");
        }
    };

    const actionButton = (id) => {
        const classroom = classes.find((classroom) => classroom.id === id);

        if (classroom) {
            setId(classroom.id);
            setClassId(classroom.classId);
            setName(classroom.name);
            setStatus(classroom.status);

            if (classroom.startDate && classroom.endDate && classroom.examDate) {
                const formattedStartDate = moment(classroom.startDate).format('YYYY-MM-DD');
                const formattedEndDate = moment(classroom.endDate).format('YYYY-MM-DD');
                const formattedExamDate = moment(classroom.examDate).format('YYYY-MM-DD');
                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);
                setExamDate(formattedExamDate);
            }
        } else {
            console.error("Course not found");
        }
    };

    // Update a course
    const handleUpdate = async () => {
        const formattedStartDate = new Date(startDate).toISOString().split('.')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('.')[0];
        const formattedExamDate = new Date(examDate).toISOString().split('.')[0];

        let res = await updateClass(id, classId, name, formattedStartDate, formattedEndDate, formattedExamDate, status);

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

    // Delete a course
    const confirmDelete = async () => {
        let res = await deleteClass(id);

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
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(classes);

        XLSX.utils.book_append_sheet(wb, ws, "Khoa Hoc");

        XLSX.writeFile(wb, "MyExcel.xlsx");
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getStatus = (item) => {
        if (item.status === 1) {
            return <span className="badge badge-success" style={{ padding: '5px' }}>Đang diễn ra</span>;
        } else {
            return <span className="badge badge-danger" style={{ padding: '5px' }}>Kết thúc</span>;
        }
    };

    const columns = [
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
            cell: (row) => getStatus(row),
        },
        {
            name: "Chức năng",
            cell: (row) =>
                <div>
                    <button type="submit" data-toggle="modal"
                            data-target="#edit_class"
                            className="btn btn-primary btn-sm mb-1"
                            onClick={() => actionButton(row.id)}>
                        <i className="ti-pencil" title="Sửa"></i>
                    </button>
                    <button type="submit" data-toggle="modal"
                            data-target="#delete_class"
                            className="btn btn-danger btn-sm mb-1"
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
        getClasses();
        getCourses();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredClasses(reversedClasses);
            return;
        }
        const result = reversedClasses.filter(classroom => {
            return classroom.classId?.toLowerCase().match(search.toLowerCase());
        });
        setFilteredClasses(result);
    }, [search, reversedClasses]);

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
                                            <h1 style={{fontWeight: "bold", fontSize: "25px"}}>QUẢN LÝ LỚP HỌC</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 p-l-0 title-margin-left">
                                <div className="page-header">
                                    <div className="page-title">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                            <li className="breadcrumb-item active">
                                                <strong>Lớp học</strong>
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
                                            title="Danh sách lớp học"
                                            columns={columns}
                                            data={filteredClasses}
                                            customStyles={customStyles}
                                            pagination
                                            fixedHeader
                                            fixedHeaderScrollHeight="400px"
                                            highlightOnHover
                                            actions={
                                                <div>
                                                    <button className="btn btn-primary mr-3"
                                                            data-toggle="modal" data-target="#add_class">Thêm lớp học</button>
                                                    <button className="btn btn-success"
                                                            onClick={handleOnExport}>Xuất File Excel</button>
                                                </div>
                                            }
                                            subHeader
                                            subHeaderAlign="left"
                                            subHeaderComponent={
                                                <input
                                                    type="text"
                                                    placeholder="Nhập mã lớp"
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

                        <div id="add_class" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Thêm lớp học</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Mã lớp</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: 25CB0501"
                                                           value={classId}
                                                           onChange={(event) => {
                                                               setClassId(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Tên lớp học</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: Cơ bản 05/01/25"
                                                           value={name}
                                                           onChange={(event) => {
                                                               setName(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Khóa học</label>
                                                    <select
                                                        className="form-control select"
                                                        value={courseId}
                                                        onChange={(event) => {
                                                            const selectedCourseId = event.target.value ? parseInt(event.target.value) : null;
                                                            setCourseId(selectedCourseId);
                                                        }}
                                                    >
                                                        <option value="">---Chọn khóa học---</option>
                                                        {courses && courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày thi</label>
                                                    <input type="date" className="form-control" required
                                                           value={examDate}
                                                           onChange={(event) => {
                                                               setExamDate(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày bắt đầu</label>
                                                    <input type="date" className="form-control" required
                                                           value={startDate}
                                                           onChange={(event) => {
                                                               setStartDate(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày kết thúc</label>
                                                    <input type="date" className="form-control" required
                                                           value={endDate}
                                                           onChange={(event) => {
                                                               setEndDate(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="m-t-20 text-center">
                                            <button className="btn btn-primary btn-lg"
                                                    onClick={() => handleSave()}>Tạo lớp học
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="edit_class" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Chỉnh sửa lớp học</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Mã lớp</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: 25CB0501"
                                                           value={classId}
                                                           onChange={(event) => {
                                                               setClassId(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Tên lớp học</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: Cơ bản 05/01/25"
                                                           value={name}
                                                           onChange={(event) => {
                                                               setName(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày thi</label>
                                                    <input type="date" className="form-control" required
                                                           value={examDate}
                                                           onChange={(event) => {
                                                               setExamDate(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày bắt đầu</label>
                                                    <input type="date" className="form-control" required
                                                           value={startDate}
                                                           onChange={(event) => {
                                                               setStartDate(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Ngày kết thúc</label>
                                                    <input type="date" className="form-control" required
                                                           value={endDate}
                                                           onChange={(event) => {
                                                               setEndDate(event.target.value);
                                                           }}
                                                    />
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

                        <div id="delete_class" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-md">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Xóa lớp học</h4>
                                    </div>
                                    <div className="modal-body">
                                        <p>Bạn có chắc muốn xóa lớp học này?</p>
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

export default Classes;