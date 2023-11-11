import axios from "axios";
import Cookies from 'js-cookie';

class HttpRequestAxiosQueueUtility {
    // constructor which takes the axios instance and initializes a queue for making network request one after the other sequentially
    constructor(instance) {
        this.instance = instance;
        // initializing the queue with the promise which resolves immediately
        this.queue = Promise.resolve();
    }

    // requesting the backend api for getting the csrf token in a cookie named XSRF-TOKEN
    async getCsrf() {
        const promise = this.instance.get("http://localhost:8080/api/user/csrf-token")
        return promise;
    }

    // method which takes the url and the config object of the get request and returns a promise of that request after appending our network request promise to the promise queue
    get(url, config) {
        // adding our get network request promise to the promise queue
        this.queue = this.queue.then(async () => {
            // getting our csrf cookie value from the XSRF-TOKEN cookie before making any api request as we need the csrf token to validate our request
            let csrfCookie = Cookies.get('XSRF-TOKEN');
            // if the csrf token is not present then we request for new csrf token using the getcsrf method
            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }
            // making our custom config and adding "Content-Type" header as "application/json" and adding "X-XSRF-TOKEN" header with our csrf token so that the backend api can validate by verifying our header's "X-XSRF-TOKEN" value with the cookie named XSRF-TOKEN
            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }
            // adding the config which was passed to this function for network request and merging it with our myconfig preset config so that the csrf token also get's attached to our custom config during network request
            myconfig = Object.assign(myconfig, config);
            console.log(myconfig)
            // making our network request using the axios instance and passing our url and myconfig parameters
            const promise = this.instance.get(url, myconfig)
            // without awaiting our promise we are returning our promise so that it can be added to the promise queue
            return promise;
        }).catch(error => {
            // if any error occurs while making the network request we are printing the error
            console.error('GET request failed:', error);
            //And Reset the queue so that the unresolved promise didnot get's stuck in the promise queue.if we didnot reset the promise queue as we have unresloved promise we get network error every time we make a new request that's why we reset the promise queue
            this.queue = Promise.resolve();
            // throwing the error to the parent function which called this function
            throw error;
        });
        //   returing the pending promise queue with our network request promise
        return this.queue;
    }


    // method which takes the url,data and the config object of the post request and returns a promise of that request after appending our network request promise to the promise queue
    post(url, data, config) {

        // adding our post network request promise to the promise queue
        this.queue = this.queue.then(async () => {
            // getting our csrf cookie value from the XSRF-TOKEN cookie before making any api request as we need the csrf token to validate our request
            let csrfCookie = Cookies.get('XSRF-TOKEN');
            // if the csrf token is not present then we request for new csrf token using the getcsrf method
            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }
            // making our custom config and adding "Content-Type" header as "application/json" and adding "X-XSRF-TOKEN" header with our csrf token so that the backend api can validate by verifying our header's "X-XSRF-TOKEN" value with the cookie named XSRF-TOKEN
            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }

            // adding the config which was passed to this function for network request and merging it with our myconfig preset config so that the csrf token also get's attached to our custom config during network request
            myconfig = Object.assign(myconfig, config);
            console.log(myconfig)
            // making our network request using the axios instance and passing our url,data and myconfig parameters
            let promise = this.instance.post(url, data, myconfig)
            // without awaiting our promise we are returning our promise so that it can be added to the promise queue
            return promise;
        }).catch(error => {
            // if any error occurs while making the network request we are printing the error
            console.error('POST request failed:', error);
            //And Reset the queue so that the unresolved promise do not get's stuck in the promise queue.if we do not reset the promise queue as we are having unresloved promise we get network error every time we make a new request that's why we reset the promise queue
            this.queue = Promise.resolve();
            // throwing the error to the parent function which called this function
            throw error;
        });
        //   returing the pending promise queue with our network request promise
        return this.queue;
    }


    // method which takes the url,data and the config object of the put request and returns a promise of that request after appending our network request promise to the promise queue
    put(url, data, config) {

        // adding our put network request promise to the promise queue
        this.queue = this.queue.then(async () => {
            // getting our csrf cookie value from the XSRF-TOKEN cookie before making any api request as we need the csrf token to validate our request
            let csrfCookie = Cookies.get('XSRF-TOKEN');
            // if the csrf token is not present then we request for new csrf token using the getcsrf method
            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }
            // making our custom config and adding "Content-Type" header as "application/json" and adding "X-XSRF-TOKEN" header with our csrf token so that the backend api can validate by verifying our header's "X-XSRF-TOKEN" value with the cookie named XSRF-TOKEN
            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }
            // adding the config which was passed to this function for network request and merging it with our myconfig preset config so that the csrf token also get's attached to our custom config during network request
            myconfig = Object.assign(myconfig, config);
            console.log(myconfig)
            // making our network request using the axios instance and passing our url,data and myconfig parameters
            let promise = this.instance.put(url, data, myconfig)
            // without awaiting our promise we are returning our promise so that it can be added to the promise queue
            return promise;
        }).catch(error => {
            // if any error occurs while making the network request we are printing the error
            console.error('PUT request failed:', error);
            //And Reset the queue so that the unresolved promise didnot get's stuck in the promise queue.if we didnot reset the promise queue as we have unresloved promise we get network error every time we make a new request that's why we reset the promise queue
            this.queue = Promise.resolve();
            // throwing the error to the parent function which called this function
            throw error;
        });
        //   returing the pending promise queue with our network request promise
        return this.queue;
    }


    // method which takes the url and the config object of the delete request and returns a promise of that request after appending our network request promise to the promise queue
    delete(url, config) {
        // adding our delete network request promise to the promise queue
        this.queue = this.queue.then(async () => {
            // getting our csrf cookie value from the XSRF-TOKEN cookie before making any api request as we need the csrf token to validate our request
            let csrfCookie = Cookies.get('XSRF-TOKEN');
            // if the csrf token is not present then we request for new csrf token using the getcsrf method
            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }
            // making our custom config and adding "Content-Type" header as "application/json" and adding "X-XSRF-TOKEN" header with our csrf token so that the backend api can validate by verifying our header's "X-XSRF-TOKEN" value with the cookie named XSRF-TOKEN
            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }
            // adding the config which was passed to this function for network request and merging it with our myconfig preset config so that the csrf token also get's attached to our custom config during network request
            myconfig = Object.assign(myconfig, config);
            console.log(myconfig)
            // making our network request using the axios instance and passing our url and myconfig parameters
            let promise = this.instance.delete(url, myconfig)
            // without awaiting our promise we are returning our promise so that it can be added to the promise queue
            return promise;
        }).catch(error => {
            // if any error occurs while making the network request we are printing the error
            console.error('Delete request failed:', error);
            //And Reset the queue so that the unresolved promise didnot get's stuck in the promise queue.if we didnot reset the promise queue as we have unresloved promise we get network error every time we make a new request that's why we reset the promise queue
            this.queue = Promise.resolve();
            // throwing the error to the parent function which called this function
            throw error;
        });
        //   returing the pending promise queue with our network request promise
        return this.queue;
    }

    // function which is used to check if the user is authenticated or not by calling the backend api for checking if the user is logged in or not
    isAuthenticated() {
        // adding our get network request promise for checking authentication to the promise queue
        this.queue = this.queue.then(async () => {
            // getting our csrf cookie value from the XSRF-TOKEN cookie before making any api request as we need the csrf token to validate our request
            let csrfCookie = Cookies.get('XSRF-TOKEN');
            // if the csrf token is not present then we request for new csrf token using the getcsrf method
            if (!csrfCookie) {
                await this.getCsrf()
                csrfCookie = Cookies.get('XSRF-TOKEN');
            }
            // making our custom config and adding "Content-Type" header as "application/json" and adding "X-XSRF-TOKEN" header with our csrf token so that the backend api can validate by verifying our header's "X-XSRF-TOKEN" value with the cookie named XSRF-TOKEN
            let myconfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfCookie
                }
            }
            // making our network request using the axios instance and passing our url and myconfig parameters to check if the user is authenticated or not
            const promise = this.instance.get("http://localhost:8080/api/user/is-authenticated", myconfig)
            // without awaiting our promise we are returning our promise so that it can be added to the promise queue
            return promise;
        }).catch(error => {
            // if any error occurs while making the network request we are printing the error
            console.error('Authenticating request failed:', error);
            //And Reset the queue so that the unresolved promise didnot get's stuck in the promise queue.if we didnot reset the promise queue as we have unresloved promise we get network error every time we make a new request that's why we reset the promise queue
            this.queue = Promise.resolve();
            // throwing the error to the parent function which called this function
            throw error;
        });
        //   returing the pending promise queue with our network request promise
        return this.queue;
    }



    // function which checks if the user is authenticated or not and then makes the get request
    authenticatedGet(url, config) {
        this.isAuthenticated()
        return this.get(url, config);

    }


    // function which checks if the user is authenticated or not and then makes the post request
    authenticatedPost(url, data, config) {
        this.isAuthenticated()
        return this.post(url, data, config)
    }


    // function which checks if the user is authenticated or not and then makes the put request
    authenticatedPut(url, data, config) {
        this.isAuthenticated()
        return this.put(url, data, config)
    }

    // function which checks if the user is authenticated or not and then makes the delete request
    authenticatedDelete(url, config) {
        this.isAuthenticated()
        return this.delete(url, config);
    }



}

// Create an instance of axios and setting withCredentials option as true so that we can get the cookies from the backend
const instance = axios.create({
    withCredentials: true
});

// Create an object of AxiosQueue by supplying the HttpRequestAxiosQueueUtility instance of axios as a constructor parameter
const httpRequestAxiosQueueUtility = new HttpRequestAxiosQueueUtility(instance);

// exporting our httpRequestAxiosQueueUtility object
export default httpRequestAxiosQueueUtility
