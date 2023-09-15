import { APIS , BaseUrl } from "../../config/constant/URLS";
import fetch from '../../config/interceptor/interceptor'


export const sendEmail = (senderEmail , message) => {
    return fetch({
        method : 'get',
        url : BaseUrl + APIS.CONTACT.sendEmail(senderEmail , message),
    });
}