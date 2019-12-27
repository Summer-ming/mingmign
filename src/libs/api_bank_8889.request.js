import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:8889/jgerp/' : config.baseUrl.pro_8889
console.log(baseUrl)
const axios = new HttpRequest(baseUrl)
export default axios