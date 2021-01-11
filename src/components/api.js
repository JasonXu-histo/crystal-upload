import axios from 'axios'
export const getSignature = (url) => {
  return axios.get(url)
}