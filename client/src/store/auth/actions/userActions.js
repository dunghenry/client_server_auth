import axios from 'axios';
//Action creator 
export const loginUser = (values, history, setSubmitting) => async dispatch => {
    dispatch({
        type: 'LOGIN_USER_START',
    })
    try {
        const response = await axios.post('http://localhost:4000/auth/login', values);
        if (response.data) {
            dispatch({
                type: 'LOGIN_USER_SUCCESS',
                payload: response.data
            })
            history.push('/dashboard');
            setSubmitting(false);
        }
    } catch (error) {
        dispatch({
            type: 'LOGIN_USER_FAILED',
            payload: error.response.data
        })
        setSubmitting(false);
    }
}
export const signupUser = (values, history, setSubmitting) => async dispatch => {
    dispatch({
        type: 'SIGNUP_USER_START'
    })
    try {
        const { email, name, password } = values;
        const response = await axios.post('http://localhost:4000/auth/register', { email, name, password });
        if (response.data) {
            dispatch({
                type: 'SIGNUP_USER_SUCCESS',
            })
            history.push('/login');
            setSubmitting(false);
        }
    } catch (error) {
        dispatch({
            type: 'SIGNUP_USER_FAILED',
            payload: error.response.data
        })
        setSubmitting(false);
    }
}
export const logoutUser = (history) => async dispatch => {
    dispatch({
        type: 'LOGOUT_USER_START'
    })
    try {
        const response = await axios('http://localhost:4000/auth/logout');
        if (response.data) {
            dispatch({
                type: 'LOGOUT_USER_SUCCESS',
            })
            history.push('/login');
        }
    } catch (error) {
        dispatch({
            type: 'LOGOUT_USER_FAILED',
            payload: error.response.data
        })
    }
}