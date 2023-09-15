import {APIS, BaseUrl  } from '../../config/constant/URLS';
import fetch from '../../config/interceptor/interceptor'




export const enableUserById = (id , state) => {
    return fetch({
        method : 'put',
        url : BaseUrl + APIS.USERS.enableUserById(id,state)
    })
}

export const fetchUserById =  (id) => {
    return fetch( {
        method: 'get',
        url: BaseUrl + APIS.USERS.fetchUserById(id),
    })
}

export const fetchAllUsers = (pageNumber ) => {
    return fetch ({
        method: 'get',
        url: BaseUrl + APIS.USERS.fetchAllUsers(pageNumber),
    })
}

export const searchUser = (querryParam) => {
    return fetch( {
        method : 'get',
        url : BaseUrl + APIS.USERS.searchUser(querryParam),
        querryParam
    })
}

export const getCurrentUser  = () => {
    return fetch({
        method : 'get',
        url : BaseUrl + APIS.USERS.fetchCurrentUser
    })
}