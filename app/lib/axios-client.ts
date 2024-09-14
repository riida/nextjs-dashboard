import axios, { AxiosRequestConfig } from 'axios'

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost',
  timeout: 30000,
}

const client = axios.create(axiosConfig)
client.interceptors.request.use(async (request) => {
  request.withCredentials = true
  request.withXSRFToken = true
  return request
})

export default client
