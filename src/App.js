import React, { Component } from 'react';
import AddressApi           from './Api/AddressApi';
import WeatherApi           from './Api/WeatherApi';
import DailySummary         from './Components/Weather/DailySummary';
import './App.scss';

const hasPrecipitated = (weathers) => weathers.reduce((precipitated, weather) => (['Rain', 'Snow'].indexOf(weather.main) > -1 || precipitated), false);

const convertToCelsius = temp => ((temp - 32) * 5) / 9;

const createOrUpdateForecast = (currentForecast = {}, newForecast) => {
    const imperial = {
        high: Math.max((currentForecast.high || 0), newForecast.main.temp_max),
        low: Math.min((currentForecast.low || Infinity), newForecast.main.temp_min),
    }
    return {
        high: { imperial: imperial.high, metric: convertToCelsius(imperial.high) },
        low: { imperial: imperial.low,  metric: convertToCelsius(imperial.low)},
        precipitated: currentForecast.precipitated || hasPrecipitated(newForecast.weather),
    }
}


const ZIPCODE_KEY = 'commonWeatherZipcode';

class App extends Component {
    constructor() {
        super();

        this.validateZipCode = this.validateZipCode.bind(this);
        this.getForecast = this.getForecast.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.toggleUnit = this.toggleUnit.bind(this);

        const sessionZipcode = localStorage.getItem(ZIPCODE_KEY) || '';

        this.state = {
            zipcode: { value: sessionZipcode, valid: true },
            forecast: [],
        };

        if (sessionZipcode) {
            this.getForecast();
        }
    }

    async validateZipCode() {
        return AddressApi.get(this.state.zipcode.value);
    }

    handleOnChange(e) {
        const zipcode = e.currentTarget.value;
        this.setState({
            zipcode: { value: zipcode, valid: true },
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            await this.validateZipCode();
            localStorage.setItem(ZIPCODE_KEY, this.state.zipcode.value);
            this.getForecast();
        } catch (e) {
            this.setState({ zipcode: { ...this.state.zipcode, valid: false }});
        }
    }

    async getForecast() {
        try {
            const forecastResults = await WeatherApi.getForecast({ zip: this.state.zipcode.value, units: 'imperial' });
            const dailyForecast = forecastResults.list.reduce((forecasts, forecast) => {
                const date = new Date(forecast.dt * 1000).toDateString();
                forecasts[date] = createOrUpdateForecast(forecasts[date], forecast);
                return forecasts;
            }, {});
            this.setState({ forecast: dailyForecast });
        } catch (e) {
            alert('😥');
        }
    }

    toggleUnit() {
        this.setState({unit: !this.state.unit});
    }

    render() {
        return (
            <div className="App container">
                <form onSubmit={ this.handleSubmit } className="input-group mb-3">
                    <input
                        className="form-control"
                        onChange={ this.handleOnChange }
                        value={ this.state.zipcode.value }
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                    { !this.state.zipcode.valid && this.state.zipcode.value ?
                        <div className="">This is not a valid US zipcode</div>
                        : null
                    }
                </form>
                <input type="radio" name="units" value="imperial" onChange={ this.toggleUnit }/>
                <input type="radio" name="units" value="metric"  onChange={ this.toggleUnit }/>
                <div className="row">
                    { Object.keys(this.state.forecast).map(date =>
                        <div className="col-2" key={date}>
                            <DailySummary
                                date={ date }
                                { ...this.state.forecast[date] }
                                unitDisplay={this.state.unit }
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
