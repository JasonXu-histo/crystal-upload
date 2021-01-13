import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create()
request.interceptors.request.use(config => {
  if (window.localStorage.getItem('crystal-token')) {
    config.headers['crystal-token'] = window.localStorage.getItem('crystal-token')
  }
  return config
},
error => {
  Promise.reject(error)
})

request.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)

export const getSignature = (url) => {
  return request({
    url,
    method: 'get'
  })
}

export const preCheck = (url, data) => {
  return request({
    url,
    method: 'post',
    data
  })
}

export const saveResourceInfo = (url, params) => {
  return request({
    url,
    method: 'get',
    params
  })
}
