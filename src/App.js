import React, { Component } from 'react';
import AddressApi           from './Api/AddressApi';
import WeatherApi           from './Api/WeatherApi';
import DailySummary         from './Components/Weather/DailySummary';
import './App.scss';

const hasPrecipitated = (weather) => ['Rain', 'Snow'].indexOf(weather) > -1;

class App extends Component {
    constructor() {
        super();

        this.validateZipCode = this.validateZipCode.bind(this);
        this.getForecast = this.getForecast.bind(this);

        this.state = {
            zipcode: {},
            forecast: [],
        };
    }

    validateZipCode(e) {
        const zipcode = e.currentTarget.value;
        this.setState({
            zipcode: { value: zipcode, valid: true },
        })

        if (zipcode.length === 5 || zipcode.length === 9) {
            AddressApi.get(zipcode).then(res => {}, error => {
                this.setState({
                    zipcode: Object.assign(this.state.zipcode, { valid: false })
                })
            })
        }
    }

    getForecast() {
        WeatherApi.getForecast({ zip: this.state.zipcode.value, units: 'imperial' }).then(res => {
            const dailyForecast = res.list.reduce((forecasts, forecast) => {
                const date = new Date(forecast.dt * 1000);
                if (forecasts[date.toDateString()]) {
                    forecasts[date.toDateString()] = {
                        high: Math.max(forecasts[date.toDateString()].high, forecast.main.temp_max),
                        low: Math.min(forecasts[date.toDateString()].low, forecast.main.temp_min),
                        precipitated: forecasts[date.toDateString()].precipitated || hasPrecipitated(forecast.weather.main),
                    }
                } else {
                    forecasts[date.toDateString()] = {
                        high: forecast.main.temp_max,
                        low: forecast.main.temp_min,
                        precipitated: hasPrecipitated(forecast.weather.main),
                    }
                }
                return forecasts;
            }, {});
            this.setState({ forecast: dailyForecast });
        })
    }

    render() {
        return (
            <div className="App container">
                <div class="input-group mb-3">
                    <input className="form-control" onBlur={ this.validateZipCode } />
                    <div class="input-group-append">
                        <button className="btn btn-primary" onClick={ this.getForecast }>Submit</button>
                    </div>
                    { !this.state.zipcode.valid && this.state.zipcode.value ?
                        <div className="">This is not a valid US zipcode</div>
                        : null
                    }
                </div>
                <div className="row">
                    { Object.keys(this.state.forecast).map(date =>
                        <div className="col-2">
                            <DailySummary date={ date } { ...this.state.forecast[date] } />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
