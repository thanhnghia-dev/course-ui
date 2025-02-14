import React, {useEffect, useState} from "react";
import Header from "../components/NavigationBar";
import NavigationBar from "../components/Header";
import {TabTitle} from "../utils/DynamicTitle";
import Footer from "../components/Footer";
import DataTable from "react-data-table-component";
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";
import {createCourse, deleteCourse, fetchAllCourses, updateCourse} from "../service/CourseService";
import {Bounce, toast, ToastContainer} from "react-toastify";

const Courses = () => {
    TabTitle('Quản lý Khóa học | Trung Tâm Tin Học LP');

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    
    const [id, setId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [name, setName] = useState('');
    
    const getCourses = async () => {
        let res = await fetchAllCourses();
        if (res) {
            setCourses(res);
        }
    }

    // Save a new course
    const handleSave = async () => {
        if (!courseId || !name) {
            toast.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        let res = await createCourse(courseId, name);

        if (res && res.id) {
            setCourseId('');
            setName('');

            toast.success("Tạo khóa học thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Tạo khóa học thất bại!");
        }
    }

    const actionButton = (id) => {
        const course = courses.find((course) => course.id === id);

        if (course) {
            setId(course.id);
            setCourseId(course.courseId);
            setName(course.name);
        } else {
            console.error("Course not found");
        }
    };

    // Update a course
    const handleUpdate = async () => {
        let res = await updateCourse(id, courseId, name);

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
        let res = await deleteCourse(id);

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
        const formattedData = courses.map((row, index) => ({
            Stt: index + 1,
            "Mã Khóa học": row.courseId,
            "Tên Khóa học": row.name,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);

        XLSX.utils.book_append_sheet(wb, ws, "Khoa Hoc");

        XLSX.writeFile(wb, "Danh_sach_khoa_hoc.xlsx");
    }

    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
        },
        {
            name: "Mã Khóa học",
            selector: (row) => row.courseId,
        },
        {
            name: "Tên Khóa học",
            selector: (row) => row.name,
        },
        {
            name: "Chức năng",
            cell: (row) =>
                <div>
                    <button type="submit" data-toggle="modal"
                            data-target="#edit_course"
                            className="btn btn-primary btn-sm mb-1"
                            onClick={() => actionButton(row.id)}>
                        <i className="ti-pencil" title="Sửa"></i>
                    </button>
                    <button type="submit" data-toggle="modal"
                            data-target="#delete_course"
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
        getCourses();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredCourses(courses);
            return;
        }

        const result = courses.filter(course => {
            return course.courseId?.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredCourses(result);
    }, [search, courses]);

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
                                            <h1 style={{fontWeight: "bold", fontSize: "25px"}}>QUẢN LÝ KHÓA HỌC</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 p-l-0 title-margin-left">
                                <div className="page-header">
                                    <div className="page-title">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                            <li className="breadcrumb-item active">
                                                <strong>Khóa học</strong>
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
                                        <DataTable
                                            title="Danh sách Khóa học"
                                            columns={columns}
                                            data={filteredCourses}
                                            customStyles={customStyles}
                                            pagination
                                            fixedHeader
                                            fixedHeaderScrollHeight="400px"
                                            highlightOnHover
                                            actions={
                                                <div>
                                                    <button className="btn btn-primary mr-3"
                                                            data-toggle="modal" data-target="#add_course">Thêm khóa học</button>
                                                    <button className="btn btn-success"
                                                            onClick={handleOnExport}>Xuất File Excel</button>
                                                </div>
                                            }
                                            subHeader
                                            subHeaderAlign="left"
                                            subHeaderComponent={
                                                <input
                                                    type="text"
                                                    placeholder="Nhập mã khóa học"
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

                        <div id="add_course" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Thêm khóa học</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Mã khóa học</label>
                                            <input type="text" className="form-control" required
                                                   placeholder="VD: CB"
                                                   value={courseId}
                                                   onChange={(event) => {
                                                       setCourseId(event.target.value);
                                                   }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tên khóa học</label>
                                            <input type="text" className="form-control" required
                                                   placeholder="VD: Ứng dụng CNTT Cơ bản"
                                                   value={name}
                                                   onChange={(event) => {
                                                       setName(event.target.value);
                                                   }}
                                            />
                                        </div>
                                        <div className="m-t-20 text-center">
                                            <button className="btn btn-primary btn-lg"
                                                    onClick={() => handleSave()}>Tạo khóa học
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="edit_course" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Chỉnh sửa khóa học</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Mã khóa học</label>
                                            <input type="text" className="form-control" required
                                                   placeholder="VD: CB"
                                                   value={courseId}
                                                   onChange={(event) => {
                                                       setCourseId(event.target.value);
                                                   }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tên khóa học</label>
                                            <input type="text" className="form-control" required
                                                   placeholder="VD: Ứng dụng CNTT Cơ bản"
                                                   value={name}
                                                   onChange={(event) => {
                                                       setName(event.target.value);
                                                   }}
                                            />
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

                        <div id="delete_course" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-md">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Xóa Khóa học</h4>
                                    </div>
                                    <div className="modal-body">
                                        <p>Bạn có chắc muốn xóa khóa học này?</p>
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

export default Courses;