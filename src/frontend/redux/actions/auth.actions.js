import {AuthTypes} from '../types/index'

export const login = (data) => {
  
    return {
        type: AuthTypes.LOGIN_SUCCESS,
        payload: data
    }
}

export const signup = (data) => {
    return {
        type: AuthTypes.SIGNUP_SUCCESS,
        payload: data,
    }
}

export const logout = () => {
    return {
        type: AuthTypes.LOGOUT_REQUEST
    }
}