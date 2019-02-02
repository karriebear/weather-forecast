import axiosLib  from 'axios';

const axios = axiosLib.create({
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default class Api {
    constructor(client = axios) {
        this.client = client;
    }

    get(api, params = {}) {
        return this.client.get(api, params).then((res) => {
            if (res.status >= 200 && res.status < 300 && res.data) {
                return res.data;
            }
            return null;
        });
    }
}
