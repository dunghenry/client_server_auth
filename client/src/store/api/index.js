import axios from axios;
import jwt_decode from 'jwt-decode';
export const requestRefreshToken = async () => {
    try {
        const res = await axios.post('http://localhost:4000/auth/refreshToken', {
            withCredentials: true,
        })
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
export const customAxios = (user, dispatch, stateSuccess) => {
    const API = axios.create();
    API.interceptors.request.use(async config => {
        let date = new Date();
        const decodedToken = jwt_decode()
        if (decodedToken.exp < date.getTime() / 1000) {
            const data = await requestRefreshToken();
            const refreshUser = {
                ...user,
                accessToken: data?.accessToken,
            }
            dispatch(stateSuccess(refreshUser));
            config.headers["token"] = "Bearer " + data?.accessToken;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    return API;
}