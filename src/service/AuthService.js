import axios from "./CustomizeAxios";

const register = (fullName, username, password, gender, role) => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('gender', gender);
    formData.append('role', role);

    return axios.post('auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const login = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return axios.post('auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

const logout = (accessToken) => {
    return axios.post('auth/logout',
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
}

export {register, login, logout};
