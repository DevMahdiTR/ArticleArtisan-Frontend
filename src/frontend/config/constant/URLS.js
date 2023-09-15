export const BaseUrl = "http://localhost:8080/api/v1";

export const APIS = {

    AUTH : {
        login : '/auth/login',
        register : '/auth/register',
        logout : '/auth/logout',
        refreshToken : '/auth/refresh',
    },
    CATEGORIES : {
        addCategorie : '/categorie/admin/add',
        fetchCategorieById: (id) => `/categorie/all/get/id/${id}`,
        fetchAllCategories : (pageNumber) => `/categorie/all/get/all_categories?pageNumber=${pageNumber}`,
        searchCategories : (prefix) => `/categorie/all/get/prefix/${prefix}`,
        updateCategorieById : (id) => `/categorie/admin/update/id/${id}`,
        deleteCategorieById : (id) => `/categorie/admin/delete/id/${id}`,
    },
    AFFICHE : {
        addAffiche : '/affiche/admin/create_affiche',
        fetchAfficheImageById : (id) => `/affiche/all/get_affiche_image/id/${id}`,
        fetchAllAffiche : (pageNumber) => `/affiche/all/get/all_affiche?pageNumber=${pageNumber}`,
        updateAfficheById : (id) => `/affiche/admin/update/id/${id}`,
        searchAffiche : (prefix)=> `/affiche/all/get/prefix/${prefix}`,
        deleteAfficheById : (id) => `/affiche/admin/delete/id/${id}`,
    },
    ARTICLES : {
        addArticle : '/article/admin/create_article',
        fetchArticleImageById : (id) => `/article/all/get_article_image/id/${id}`,
        fetchArticleById : (id) => `/article/all/get/id/${id}`,
        searchArticle : '/article/all/get/search',
        fetchAllArticles : (pageNumber) => `/article/all/get/all_articles?pageNumber=${pageNumber}`,
        fetchAllArticlesByCategorie : (categorieId) => `/article/all/get/all_articles/categorie_id?categorieId=${categorieId}`,
        updateArticleById : (id) => `/article/admin/update/id/${id}`,
        deleteArticleById : (id) => `/article/admin/delete/id/${id}`,
        subscribeToArticle : (id) => `/article/client/update/subscribe/article_id/${id}`,
        unsubscribeToArticle : (id) => `/article/client/update/unsubscribe/article_id/${id}`,
    },
    USERS : {
        fetchUserById : (id) => `/user_entity/admin/get/id/${id}`,
        fetchAllUsers : (pageNumber) => `/user_entity/admin/get/all/users?pageNumber=${pageNumber}`,
        searchUser : (querry) => `/user_entity/admin/search?${querry}`,
        enableUserById : (id,state) => `/user_entity/admin/update/enable/id/${id}?enabled=${state}`,
        fetchCurrentUser : '/user_entity/all/get/current_user',
    },
    CONTACT : {
        sendEmail  : (senderEmail , message) => `/contact/client/mail/sender_email/${senderEmail}/message/${message}`,
    }
}