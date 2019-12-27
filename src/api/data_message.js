import axios from '@/libs/api.request_message'


export const sendSmsApi = (param) => {
    return axios.request({
        url: 'sendSmsApi',
        method: 'get',
        params: param
    })
}
