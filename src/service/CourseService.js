import axios from "./CustomizeAxios";

const fetchAllCourses = () => {
    return axios.get(`public/courses`);
}

const createCourse = (courseId, name) => {
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('name', name);

    return axios.post('public/courses', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const updateCourse = (id, courseId, name) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('courseId', courseId);
    formData.append('name', name);

    return axios.put(`public/courses/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const deleteCourse = (id) => {
    return axios.delete(`public/courses/${id}`);
}

export {fetchAllCourses, createCourse, updateCourse, deleteCourse};
