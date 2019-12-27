import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = 'http://114.215.196.145/'

const axios = new HttpRequest(baseUrl)
export default axios
