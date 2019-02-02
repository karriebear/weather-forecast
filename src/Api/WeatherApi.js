import Api from './Api';

const token = '738e6280d357d83b38142be4626e0e3a';

export class WeatherApi extends Api {
    constructor(client) {
        super(client);

        this.getForecast = this.getForecast.bind(this);
    }
    
    getForecast(data) {
        Object.assign(data, { appid: token });
        return this.get('http://api.openweathermap.org/data/2.5/forecast/', { params: data }).then((res) => {
            return res;
        });
    }
}

const WeatherApiSingleton = new WeatherApi();

export default WeatherApiSingleton;
