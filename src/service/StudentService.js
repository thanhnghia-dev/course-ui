import axios from "./CustomizeAxios";

const fetchAllStudents = () => {
    return axios.get(`public/students`);
}

const fetchAllStudentsByClass = (classId) => {
    return axios.get(`public/students/by-class?classId=${classId}`);
}

const createStudent = (lastName, firstName, phoneNumber, dob, birthPlace, gender, citizenId, classId, note) => {
    const formData = new FormData();
    formData.append('lastName', lastName);
    formData.append('firstName', firstName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dob', dob);
    formData.append('birthPlace', birthPlace);
    formData.append('gender', gender);
    formData.append('citizenId', citizenId);
    formData.append('classId', classId);
    formData.append('note', note);

    return axios.post('public/students', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const updateStudent = (id, classId, lastName, firstName, phoneNumber, dob, birthPlace, gender, citizenId, note, status) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('classId', classId);
    formData.append('lastName', lastName);
    formData.append('firstName', firstName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dob', dob);
    formData.append('birthPlace', birthPlace);
    formData.append('gender', gender);
    formData.append('citizenId', citizenId);
    formData.append('note', note);
    formData.append('status', status);

    return axios.put(`public/students/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const deleteStudent = (id) => {
    return axios.delete(`public/students/${id}`);
}

export {fetchAllStudents, fetchAllStudentsByClass, createStudent, updateStudent, deleteStudent};
