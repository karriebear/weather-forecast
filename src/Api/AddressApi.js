import Api from './Api';

export class ZipcodeApi extends Api {
    get(zipcode) {
        return this.client.get(`https://www.zippopotam.us/us/${zipcode}`).then((res) => {
            return res;
        });
    }
}

const ZipcodeApiSingleton = new ZipcodeApi();

export default ZipcodeApiSingleton;
