import React, {useEffect, useState} from "react";
import Header from "../components/NavigationBar";
import NavigationBar from "../components/Header";
import {TabTitle} from "../utils/DynamicTitle";
import DataTable from "react-data-table-component";
import {Link} from "react-router-dom";
import * as XLSX from 'xlsx';
import {
    createStudent,
    deleteStudent,
    fetchAllStudentsByClass,
    updateStudent
} from "../service/StudentService";
import moment from "moment/moment";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {fetchAllClasses} from "../service/ClassService";

const Students = () => {
    TabTitle('Quản lý Học viên | Trung Tâm Tin Học LP');

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [gender, setGender] = useState('');
    const [classId, setClassId] = useState(null);
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('');

    const getStudents = async (classId) => {
        let res = await fetchAllStudentsByClass(classId);
        if (res) {
            setStudents(res);
        }
    }

    const getClasses = async () => {
        let res = await fetchAllClasses();
        if (res) {
            setClasses(res);
        }
    }

    // Save a new student
    const handleSave = async () => {
        if (!firstName || !lastName || !phone || !dob || !birthPlace || !note || gender === "default") {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const formattedDob = new Date(dob).toISOString().split('.')[0];

        let res = await createStudent(lastName, firstName, phone, formattedDob, birthPlace, gender, classId, note);

        if (res && res.id) {
            setLastName('');
            setFirstName('');
            setPhone('');
            setDob('');
            setBirthPlace('');
            setNote('');
            setGender("default");

            setFilteredStudents((prevStudents) => [
                ...prevStudents,
                {
                    id: res.id,
                    studentId: res.studentId,
                    lastName,
                    firstName,
                    phoneNumber: phone,
                    dob: formattedDob,
                    birthPlace,
                    gender,
                    note,
                    status: 1,
                },
            ]);

            toast.success("Tạo học viên thành công!");
        } else {
            toast.error("Tạo học viên thất bại!");
        }
    }

    const actionButton = (id) => {
        const student = students.find((student) => student.id === id);

        if (student) {
            setId(student.id);
            setLastName(student.lastName);
            setFirstName(student.firstName);
            setPhone(student.phoneNumber);
            setBirthPlace(student.birthPlace);
            setGender(student.gender);
            setNote(student.note);
            setStatus(student.status);
            setClassId(student.classroom ? student.classroom.id : null);

            if (student.dob) {
                const formattedDate = moment(student.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }

        } else {
            console.error("Student not found");
        }
    };

    // Update a student
    const handleUpdate = async () => {
        if (!firstName || !lastName || !phone || !dob || !birthPlace || !note || gender === "default") {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const formattedDob = new Date(dob).toISOString().split('.')[0];
        const formattedGender = Number(gender);

        let res = await updateStudent(id, classId, lastName, firstName, phone, formattedDob, birthPlace, formattedGender, note, status);

        if (res && id) {
            setFilteredStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === id
                        ? {
                            ...student,
                            classId,
                            lastName,
                            firstName,
                            phoneNumber: phone,
                            dob: formattedDob,
                            birthPlace,
                            gender: formattedGender,
                            note,
                            status,
                        }
                        : student
                )
            );

            toast.success("Cập nhật thành công!");
        } else {
            toast.error("Cập nhật thất bại!");
        }
    }

    // Delete a student
    const confirmDelete = async () => {
        let res = await deleteStudent(id);

        if (res && id) {
            setFilteredStudents((prevStudents) =>
                prevStudents.filter((student) => student.id !== id)
            );

            toast.success("Xóa thành công!");
        } else {
            toast.error("Xóa thất bại!");
        }
    }

    // Export file to Excel
    const handleOnExport = () => {
        const sortColumn = "firstName";
        const sortOrder = "asc";

        const sortedStudents = [...students].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        const formattedData = sortedStudents.map((row, index) => ({
            Stt: index + 1,
            "Họ": row.lastName,
            "Tên": row.firstName,
            "Ngày sinh": convertDateExp({ date: row.dob }),
            "Nơi sinh": row.birthPlace,
            "G.tính": getGender(row),
            "Điện thoại": row.phoneNumber,
            "Ghi chú": row.note,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const classroomName = students[0]?.classroom?.name || "Unknown Classroom";

        XLSX.utils.book_append_sheet(wb, ws, "Hoc Vien");
        XLSX.writeFile(wb, "DSHV_" + classroomName + ".xlsx");
    };

    // Normalize date-time
    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    // Normalize date-time to export file
    const convertDateExp = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('MM/DD/YYYY');
    }

    const getGender = ({ gender }) => {
        return gender === 1 ? "Nam" : gender === 0 ? "Nữ" : "Khác";
    };

    const getStatus = (item) => {
        if (item.status === 1) {
            return <span className="badge badge-warning" style={{ padding: '5px' }}>Đang học</span>;
        } else if (item.status === 2) {
            return <span className="badge badge-success" style={{ padding: '5px' }}>Hoàn thành</span>;
        } else {
            return <span className="badge badge-danger" style={{ padding: '5px' }}>Nghỉ học ngang</span>;
        }
    };

    const columns = [
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
            sortable: true,
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
            name: "Ghi chú",
            selector: (row) => row.note,
            wrap: true,
            width: "150px",
        },
        {
            name: "Trạng thái",
            selector: (row) => getStatus(row),
            wrap: true,
            width: "150px",
        },
        {
            name: "Chức năng",
            cell: (row) => (
                <div>
                    <button
                        type="submit" data-toggle="modal"
                        data-target="#edit_student"
                        className="btn-primary mb-1"
                        style={{ marginLeft: '5px' }}
                        onClick={() => actionButton(row.id)}>
                        <i className="ti-pencil" title="Sửa"></i>
                    </button>

                    <button
                        type="submit" data-toggle="modal"
                        data-target="#delete_student"
                        className="btn-danger mb-1"
                        style={{ marginLeft: '5px' }}
                        onClick={() => actionButton(row.id)}>
                        <i className="ti-trash" title="Xóa"></i>
                    </button>
                </div>
            ),
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
    }, []);

    useEffect(() => {
        if (classId) {
            getStudents(classId);
        }
    }, [classId]);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredStudents(students);
        } else {
            const result = students.filter(student => {
                return student.fullName.toLowerCase().includes(search.toLowerCase());
            });
            setFilteredStudents(result);
        }
    }, [search, students]);

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
                                        <h1 style={{fontWeight: "bold", fontSize: "25px"}}>QUẢN LÝ HỌC VIÊN</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 p-l-0 title-margin-left">
                                <div className="page-header">
                                    <div className="page-title">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                            <li className="breadcrumb-item active">
                                                <strong>Học viên</strong>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <section id="main-content">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="col-lg-3">
                                        <select
                                            className="form-control select"
                                            value={classId}
                                            onChange={(e) => {
                                                setClassId(e.target.value);
                                            }}
                                        >
                                            <option value="">---Chọn lớp học---</option>
                                            {classes &&
                                                classes.map(classroom => (
                                                    <option key={classroom.id} value={classroom.id}>
                                                        {classroom.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="card">
                                        <DataTable
                                            title="Danh sách Học viên"
                                            columns={columns}
                                            data={filteredStudents}
                                            customStyles={customStyles}
                                            pagination
                                            fixedHeader
                                            fixedHeaderScrollHeight="400px"
                                            highlightOnHover
                                            actions={
                                                <div>
                                                    <button className="btn btn-primary mr-3"
                                                            data-toggle="modal" data-target="#add_student">Thêm học viên</button>
                                                    <button className="btn btn-success"
                                                            onClick={handleOnExport}>Xuất File Excel</button>
                                                </div>
                                            }
                                            subHeader
                                            subHeaderAlign="left"
                                            subHeaderComponent={
                                                <input
                                                    type="text"
                                                    placeholder="Nhập họ tên học viên"
                                                    className="w-30 form-control"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)} // Cập nhật từ khóa tìm kiếm
                                                />
                                            }
                                            noDataComponent={<div>Không có dữ liệu để hiển thị</div>}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div id="add_student" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Thêm học viên</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Họ và tên lót</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: Nguyễn Văn"
                                                               value={lastName}
                                                               onChange={(event) => {
                                                                   setLastName(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Tên</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: A"
                                                               value={firstName}
                                                               onChange={(event) => {
                                                                   setFirstName(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Số điện thoại</label>
                                                        <input type="tel" className="form-control" required
                                                               placeholder="VD: 0989xxxx25"
                                                               value={phone}
                                                               onChange={(event) => {
                                                                   setPhone(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Ngày sinh</label>
                                                        <input type="date" className="form-control" required
                                                               value={dob}
                                                               onChange={(event) => {
                                                                   setDob(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Nơi sinh</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: TP.HCM"
                                                               value={birthPlace}
                                                               onChange={(event) => {
                                                                   setBirthPlace(event.target.value);
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
                                                            onChange={(event) => setGender(Number(event.target.value))}>
                                                            <option value="default">---Chọn giới tính---</option>
                                                            <option value={1}>Nam</option>
                                                            <option value={0}>Nữ</option>
                                                            <option value={2}>Khác</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <input type="text" className="form-control" hidden value={classId}/>
                                                <div className="form-group">
                                                    <label>Ghi chú</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: ok/ Thiếu CCCD + Hình..."
                                                           value={note}
                                                           onChange={(event) => {
                                                               setNote(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="m-t-5 text-center">
                                                <button className="btn btn-primary btn-lg mb-3"
                                                        onClick={() => handleSave()} data-dismiss="modal">Tạo học viên
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="edit_student" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-lg">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Chỉnh sửa học viên</h4>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Họ và tên lót</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: Nguyễn Văn"
                                                               value={lastName}
                                                               onChange={(event) => {
                                                                   setLastName(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Tên</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: A"
                                                               value={firstName}
                                                               onChange={(event) => {
                                                                   setFirstName(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Số điện thoại</label>
                                                        <input type="tel" className="form-control" required
                                                               placeholder="VD: 0989xxxx25"
                                                               value={phone}
                                                               onChange={(event) => {
                                                                   setPhone(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Ngày sinh</label>
                                                        <input type="date" className="form-control" required
                                                               value={dob}
                                                               onChange={(event) => {
                                                                   setDob(event.target.value);
                                                               }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Nơi sinh</label>
                                                        <input type="text" className="form-control" required
                                                               placeholder="VD: TP.HCM"
                                                               value={birthPlace}
                                                               onChange={(event) => {
                                                                   setBirthPlace(event.target.value);
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
                                                            <option value={2}>Khác</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label>Lớp học</label>
                                                        <select
                                                            className="form-control select"
                                                            value={classId}
                                                            onChange={(e) => {
                                                                setClassId(e.target.value);
                                                            }}
                                                        >
                                                            <option value="">---Chọn lớp học---</option>
                                                            {classes &&
                                                                classes.map(classroom => (
                                                                    <option key={classroom.id} value={classroom.id}>
                                                                        {classroom.name}
                                                                    </option>
                                                                ))}
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
                                                            <option value={1}>Đang học</option>
                                                            <option value={2}>Hoàn thành</option>
                                                            <option value={3}>Nghỉ học ngang</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <input type="text" className="form-control" hidden value={classId}/>
                                                <div className="form-group">
                                                    <label>Ghi chú</label>
                                                    <input type="text" className="form-control" required
                                                           placeholder="VD: ok/ Thiếu CCCD + Hình..."
                                                           value={note}
                                                           onChange={(event) => {
                                                               setNote(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="m-t-5 text-center">
                                                <button className="btn btn-primary btn-lg mb-3"
                                                        onClick={() => handleUpdate()} data-dismiss="modal">Lưu thay đổi
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div id="delete_student" className="modal fade" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content modal-md">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Xóa học viên</h4>
                                    </div>
                                    <div className="modal-body">
                                        <p>Bạn có chắc muốn xóa học viên này?</p>
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

export default Students;