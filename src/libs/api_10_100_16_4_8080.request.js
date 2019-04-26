import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = 'http://10.100.16.44:8080/jg/'
console.log(baseUrl)
const axios = new HttpRequest(baseUrl)
export default axios