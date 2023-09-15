import {BaseUrl , APIS } from '../../config/constant/URLS';
import fetch from '../../config/interceptor/interceptor';



export const addCategorie = (data)=>{
    return fetch({
        method: "post",
        url: BaseUrl+ APIS.CATEGORIES.addCategorie,
        data
    })
}

export const fetchCategorieById = (id)=>{
    return fetch({
        method: "get",
        url: BaseUrl+ APIS.CATEGORIES.fetchCategorieById(id),
    })
}

export const fetchAllCategories = (pageNumber)=>{
    return fetch({
        method: "get",
        url: BaseUrl+ APIS.CATEGORIES.fetchAllCategories(pageNumber),
    })
}

export const searchCategories = (prefix)=>{
    return fetch({
        method: "get",
        url: BaseUrl+ APIS.CATEGORIES.searchCategories(prefix),
    })
}

export const updateCategorieById = (id , data)=>{
    return fetch({
        method: "put",
        url: BaseUrl+ APIS.CATEGORIES.updateCategorieById(id),
        data
    })
}

export  const deleteCategorieById = (id)=>{
    return fetch({
        method: "delete",
        url: BaseUrl+ APIS.CATEGORIES.deleteCategorieById(id),
    })
}