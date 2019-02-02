import React  from 'react';
import PropTypes                from 'prop-types';

const propTypes = {
    high: PropTypes.number,
    low: PropTypes.number,
    precipitation: PropTypes.bool,
};

const defaultProps = {
    high: 0,
    low: 0,
    precipitation: false,
};

const DailySummary = ({ date, high, low, precipitation }) => (
    <div className="card">
        <label>{ date }</label>
        <div>
            <label>High:</label>
            <span>{ high }</span>
        </div>
        <div>
            <label>Low:</label>
            <span>{ low }</span>
        </div>
        { precipitation ? <i className="fa fa-rain" /> : null }
    </div>
)

DailySummary.propTypes = propTypes;
DailySummary.defaultProps = defaultProps;

export default DailySummary;
