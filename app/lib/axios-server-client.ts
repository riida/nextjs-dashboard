import 'server-only'
import axios, { AxiosRequestConfig } from 'axios'
import { cookies, headers } from 'next/headers'

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost',
  timeout: 30000,
}

const client = axios.create(
    axiosConfig,
)
client.interceptors.request.use(async (request) => {
  request.withCredentials = true
  request.withXSRFToken = true
  const cookie = cookies()
  const xsrfToken = cookie.get('XSRF-TOKEN')?.value ?? ''
  request.headers.Origin = headers().get('origin') ?? process.env.APP_URL
  request.headers.Referer = headers().get('referer') ?? ''
  request.headers.Cookie = cookie
  request.headers['X-XSRF-TOKEN'] = xsrfToken
  console.log('Starting Request (Server Component): ', request)
  return request
})

export default client
