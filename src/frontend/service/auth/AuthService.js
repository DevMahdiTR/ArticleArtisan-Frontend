import { APIS , BaseUrl } from "../../config/constant/URLS";
import fetch from '../../config/interceptor/interceptor';


export const LoginService = (data)=> {
    return fetch({
        method : 'post',
        url : BaseUrl + APIS.AUTH.login,
        data,
        headers : {}
    })
}

export const RegisterService = async (data)=>{
    return fetch({
        method: "post",
        url: BaseUrl+ APIS.AUTH.register,
        data
    })
}

export const RefreshToken = async (refreshToken,expiredToken) => {
    return fetch({
        method: "get",
        url : BaseUrl + APIS.AUTH.refreshToken + `/${refreshToken}?expiredToken=${expiredToken}`,
    });
}

export const logout = async () => {
    return fetch({
        method: "get",
        url: BaseUrl+ APIS.AUTH.logout
    })
};
