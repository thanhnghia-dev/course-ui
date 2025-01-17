import axios from "./CustomizeAxios";

const fetchAllClasses = () => {
    return axios.get(`public/classes`);
}

const createClasses = (courseId, classId, name, startDate, endDate, examDate) => {
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('classId', classId);
    formData.append('name', name);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('examDate', examDate);

    return axios.post('public/classes', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const updateClass = (id, classId, name, startDate, endDate, examDate, status) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('classId', classId);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('examDate', examDate);
    formData.append('status', status);

    return axios.put(`public/classes/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const deleteClass = (id) => {
    return axios.delete(`public/classes/${id}`);
}

export {fetchAllClasses, createClasses, updateClass, deleteClass};
