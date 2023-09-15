import axios from "axios";
import { notification } from "antd";
import { BaseUrl } from '../constant/URLS';
import { RefreshToken } from '../../service/auth/AuthService';
import store from '../../redux/store';
import { LoaderActions } from '../../redux/index'

const unauthroizedCode = [403];

const Interceptor = axios.create({
    baseURL: BaseUrl,
    timeout: 60000
});
const statusMessages = {
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    405: "Method Not Allowed",
    403: 'Token expired',
    408: "Request Timeout",
    409: "Conflict",
    415: "Unsupported Media Type",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    509: "Bandwidth Limit Exceeded",
    510: "Not Extended",
    511: "Network Authentication Required",
    499: "Client Closed Request",
};
const TOKEN_PAYLOAD_KEY = "Authorization";
const tokenlessPaths = ["login", "register", "refresh"];
Interceptor.interceptors.request.use(
    (config) => {

        store.dispatch(LoaderActions.toggleLoader(true));
        const AUTH_TOKEN = localStorage.getItem("token");
        const isRefreshTokenRequest = tokenlessPaths.some(path => config.url.includes(path)); 
        
        config.headers[TOKEN_PAYLOAD_KEY] = null;
        if (!isRefreshTokenRequest) {
            const jwtToken = AUTH_TOKEN || null;
            if (jwtToken) {

                config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`;
            }
        }

        return config
    },
    (error) => {
        notification.error({
            message: "Error",
        });
        Promise.reject(error);
    }
)

Interceptor.interceptors.response.use(
    (response) => {
        store.dispatch(LoaderActions.toggleLoader(false));
        return response.data;
    },
    (error) => {

        store.dispatch(LoaderActions.toggleLoader(false));

        let notificationParam = {
            message: "",
        };
        const status = error.response ? error.response.status : 500;
        notificationParam.message = statusMessages[status] || "Unknown Error";
        notificationParam.description = error.response.data.errors;
        console.log("error" + notificationParam);
        if (status === 403) {
            const accessToken = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshToken");
            RefreshToken(refreshToken, accessToken).then((res) => {
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                window.location.reload();
            })
                .catch((err) => {
                    console.log(err);
                });

        }
        notification.error(notificationParam);


        return Promise.reject(error);

    }

);

export default Interceptor;