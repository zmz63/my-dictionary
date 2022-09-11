import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const axiosInst = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 5000
})

axiosInst.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

axiosInst.interceptors.response.use(
  response => {
    if (response.data.result.code === 200) {
      return response
    } else {
      return Promise.reject(response.data)
    }
  },
  error => Promise.reject(error)
)

const request = <T>(config: AxiosRequestConfig) =>
  new Promise<T>((resolve, reject) => {
    axiosInst
      .request<{
        result: {
          msg: string
          code: number
        }
        data: T
      }>(config)
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })

export default request
