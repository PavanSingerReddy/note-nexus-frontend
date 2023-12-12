import axios from "axios";
import Cookies from 'js-cookie';

class HttpRequestAxiosQueueUtility {

    constructor(instance) {
        this.instance = instance;

        this.queue = Promise.resolve();
    }


    async getCsrf() {

        const promise = this.instance.get(import.meta.env.VITE_CSRF_TOKEN_URL)
        return promise;
    }


    get(url, config) {

        this.queue = this.queue.then(async () => {

            let csrfCookie = Cookies.get('XSRF-TOKEN');

            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }

            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }

            myconfig = Object.assign(myconfig, config);

            const promise = this.instance.get(url, myconfig)

            return promise;
        }).catch(error => {

            if (axios.isCancel(error)) {

                this.queue = Promise.resolve();

                return;
            }

            console.error('GET request failed:', error);

            this.queue = Promise.resolve();

            throw error;

        });

        return this.queue;
    }



    post(url, data, config) {


        this.queue = this.queue.then(async () => {

            let csrfCookie = Cookies.get('XSRF-TOKEN');

            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }

            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }


            myconfig = Object.assign(myconfig, config);

            let promise = this.instance.post(url, data, myconfig)

            return promise;
        }).catch(error => {


            if (axios.isCancel(error)) {

                this.queue = Promise.resolve();

                return;
            }

            console.error('POST request failed:', error);

            this.queue = Promise.resolve();

            throw error;
        });

        return this.queue;
    }



    put(url, data, config) {


        this.queue = this.queue.then(async () => {

            let csrfCookie = Cookies.get('XSRF-TOKEN');

            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }

            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }

            myconfig = Object.assign(myconfig, config);

            let promise = this.instance.put(url, data, myconfig)

            return promise;
        }).catch(error => {


            if (axios.isCancel(error)) {

                this.queue = Promise.resolve();

                return;
            }


            console.error('PUT request failed:', error);

            this.queue = Promise.resolve();

            throw error;
        });

        return this.queue;
    }



    delete(url, config) {

        this.queue = this.queue.then(async () => {

            let csrfCookie = Cookies.get('XSRF-TOKEN');

            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }

            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }

            myconfig = Object.assign(myconfig, config);

            let promise = this.instance.delete(url, myconfig)

            return promise;
        }).catch(error => {


            if (axios.isCancel(error)) {

                this.queue = Promise.resolve();

                return;
            }

            console.error('Delete request failed:', error);

            this.queue = Promise.resolve();

            throw error;
        });

        return this.queue;
    }


    isAuthenticated(config = {}) {

        this.queue = this.queue.then(async () => {

            let csrfCookie = Cookies.get('XSRF-TOKEN');

            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }

            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }


            myconfig = Object.assign(myconfig, config);


            const promise = this.instance.get(import.meta.env.VITE_CHECK_AUTHENTICATION_URL, myconfig)

            return promise;
        }).catch(error => {


            if (axios.isCancel(error)) {

                return Promise.resolve(import.meta.env.VITE_CANCEL_NETWORK_REQUEST_STRING);
            }


            console.error('Authenticating request failed:', error);

            this.queue = Promise.resolve();

            throw error;
        });

        return this.queue;
    }




    authenticatedGet(url, config) {
        this.isAuthenticated()
        return this.get(url, config);

    }



    authenticatedPost(url, data, config) {
        this.isAuthenticated()
        return this.post(url, data, config)
    }



    authenticatedPut(url, data, config) {
        this.isAuthenticated()
        return this.put(url, data, config)
    }


    authenticatedDelete(url, config) {
        this.isAuthenticated()
        return this.delete(url, config);
    }



}


const instance = axios.create({
    withCredentials: true
});


const httpRequestAxiosQueueUtility = new HttpRequestAxiosQueueUtility(instance);


export default httpRequestAxiosQueueUtility
