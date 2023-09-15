import { AuthTypes } from "../types/index";

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");


const initialState = {
    user: storedUser || {},
    token: storedToken || null,
    refreshToken: storedRefreshToken || null,
    isAuthenticated: !!storedToken, 
    errorMessage: "",
}



const AuthReducer = (state = initialState, action) => {

    switch (action.type) {
        case AuthTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                errorMessage: "",
            }
        case AuthTypes.LOGIN_ERROR:
            return {
                ...state,
                user: {},
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                errorMessage: action.message.error,
            }
        case AuthTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                user: action.user,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                errorMessage: "",
            }
        case AuthTypes.LOGOUT_REQUEST:
           
            return {
                ...state,
                user: {},
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                errorMessage: "",
            }
        default: return state;
    }
}

export default AuthReducer;

