import { BaseUrl , APIS } from "../../config/constant/URLS";
import fetch from "../../config/interceptor/interceptor";


export const addArticle = (data) => {
    return fetch({
        method: 'post',
        url: BaseUrl + APIS.ARTICLES.addArticle,
        data,
    });
};
export const searchArticle = (queryParams) => {
    return fetch({
        method : 'get',
        url : `${BaseUrl}${APIS.ARTICLES.searchArticle}?${queryParams}`,
    })
}
export const fetchArticleImageById = (id) => {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.ARTICLES.fetchArticleImageById(id),
        responseType: 'blob'
    });
};

export const fetchAllArticlesByCategorie = (categorieId) => {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.ARTICLES.fetchAllArticlesByCategorie(categorieId),
    });
}

export const fetchArticleById = (id) => {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.ARTICLES.fetchArticleById(id),
    });
};
export const fetchAllArticles = (pageNumber) => {
    return fetch({
        method: 'get',
        url: BaseUrl + APIS.ARTICLES.fetchAllArticles(pageNumber),
    });
};
export const updateArticleById = (id, data) => {
    return fetch({
        method : 'put',
        url: BaseUrl + APIS.ARTICLES.updateArticleById(id),
        data,
    });
};
export const deleteArticleById = (id) => {
    return fetch ( {

        method: 'delete',
        url : BaseUrl + APIS.ARTICLES.deleteArticleById(id),
    });
};

export const subscribeToArticle = (id) => {
    return fetch ({
        method : 'put',
        url : BaseUrl + APIS.ARTICLES.subscribeToArticle(id),
    })
}
export const unsubscribeToArticle = (id) => {
    return fetch ({
        method : 'put',
        url : BaseUrl + APIS.ARTICLES.unsubscribeToArticle(id),
    })
}
