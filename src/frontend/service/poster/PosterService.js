import {BaseUrl , APIS } from '../../config/constant/URLS';
import fetch from '../../config/interceptor/interceptor';



export const addAffiche = (data)=>{
    return fetch ( {
        method: 'post',
        url: BaseUrl + APIS.AFFICHE.addAffiche,
        data,
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const searchAffiche = (prefix)=> {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.AFFICHE.searchAffiche(prefix),
    })
}
export const fetchAllAffiche = (pageNumber) => {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.AFFICHE.fetchAllAffiche(pageNumber),
    })
}

export const fetchAfficheImageById = (id) =>{
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.AFFICHE.fetchAfficheImageById(id),
        responseType: 'blob'
    })
}

export const updateAfficheById = (id , data) =>{
    return fetch({
        method: 'put',
        url: BaseUrl + APIS.AFFICHE.updateAfficheById(id),
        data,
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteAfficheById  = (id) => {
    return fetch({
        method: 'delete',
        url: BaseUrl + APIS.AFFICHE.deleteAfficheById(id),
    })
}

