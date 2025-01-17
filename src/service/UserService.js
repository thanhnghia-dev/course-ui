import axios from "./CustomizeAxios";

const fetchAllUsers = (accessToken) => {
    return axios.get(`admin/users/user-role`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

const fetchUserInfo = (accessToken) => {
    return axios.get(`public/users/user-info`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

const updateUser = (accessToken, id, fullName, dob, gender, role, status) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('fullName', fullName);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('role', role);
    formData.append('status', status);

    return axios.put(`admin/users/update-user/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const editProfile = (accessToken, fullName, dob, gender, avatar = null) => {
    if (avatar && avatar.size > MAX_FILE_SIZE) {
        alert('The selected file is too large. Please select a file smaller than 10MB.');
        return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('dob', dob);
    formData.append('gender', gender);

    if (avatar) {
        formData.append('avatar', avatar);
    }

    return axios.put(`public/users/update-profile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

const changePassword = (accessToken, password) => {
    const formData = new FormData();
    formData.append('password', password);

    return axios.put(`public/users/change-password`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

const resetPassword = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return axios.put(`public/users/reset-password`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const checkExistUsername = (username) => {
    return axios.get(`public/users/check-exist?username=${username}`);
}

const deleteUser = (accessToken, id) => {
    return axios.delete(`admin/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });
}

export {fetchAllUsers, fetchUserInfo, updateUser, editProfile, changePassword, resetPassword, checkExistUsername, deleteUser};
