import axios from 'axios';
import Cookies from 'js-cookie';

class HttpRequestUtility{

    static axiosInstance = axios.create({
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static csrfAxiosInstance = axios.create({
        withCredentials:true
    })

    static axiosInstanceConfigured = false;

    static configAxiosInstance(){

        // Add a request interceptor
        this.axiosInstance.interceptors.request.use(async config => {
            // Call your function to get the CSRF token
            const csrfToken = await this.getCsrfToken();

            // Set the CSRF token in the headers
            config.headers['X-XSRF-TOKEN'] = csrfToken;

            return config;
        }, error => {
            return Promise.reject(error);
        });

    }


    static async getCsrfToken(){
        let csrfCookie = Cookies.get('XSRF-TOKEN');
        if(!csrfCookie){
            try {
                await this.csrfAxiosInstance.post('http://localhost:8080/api/csrf-token');
                csrfCookie = Cookies.get('XSRF-TOKEN');
            } catch (error) {
                console.error("Failed to get CSRF token ",error);
            }
        }
        return csrfCookie;
    }

    
    static getAxiosInstance(){
        if(!this.axiosInstanceConfigured){
            this.configAxiosInstance();
            this.axiosInstanceConfigured = !this.axiosInstanceConfigured
        }
        return this.axiosInstance;
    }
    
}

export default HttpRequestUtility