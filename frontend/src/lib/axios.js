import axios from 'axios'
const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_,API_URL,
    withCredentials:true

})
export default axiosInstance;