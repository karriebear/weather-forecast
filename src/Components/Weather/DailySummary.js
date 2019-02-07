import React        from 'react';
import PropTypes    from 'prop-types';

const propTypes = {
    high: PropTypes.number,
    low: PropTypes.number,
    precipitated: PropTypes.bool,
};

const defaultProps = {
    high: 0,
    low: 0,
    precipitated: false,
};

const DailySummary = ({ date, high, low, precipitated, unitDisplay }) => (
    <div className="card">
        <div className="card-body">
            <label className="card-title">{ date }</label>
            <div>
                <label>High:</label>
                <span>{ high[unitDisplay] }</span>
            </div>
            <div>
                <label>Low:</label>
                <span>{ low[unitDisplay] }</span>
            </div>
            { precipitated ? <div>Rained 🌧 </div>: null }
        </div>
    </div>
)

DailySummary.propTypes = propTypes;
DailySummary.defaultProps = defaultProps;

export default DailySummary;
