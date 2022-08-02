const initialState = {
    user: null,
    error: null,
    loading: false,
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER_START':
            return {
                ...state,
                error: null,
                loading: true,
            }
        case 'LOGIN_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: null,
            }
        case 'LOGIN_USER_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case 'LOGOUT_USER_START':
            return {
                ...state,
                loading: true,
                error: null,
            }
        case 'LOGOUT_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                user: null,
                error: null
            }
        case 'LOGOUT_USER_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'SIGNUP_USER_START':
            return {
                ...state,
                loading: true,
                error: null,
            }
        case 'SIGNUP_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
            }
        case 'SIGNUP_USER_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state;
    }
}
export default userReducer;