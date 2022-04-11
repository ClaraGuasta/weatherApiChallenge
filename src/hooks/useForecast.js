import { useState } from 'react';
import axios from 'axios';

//importing
import getCurrentDayForecast from '../helpers/getCurrentDayForecast';
import getCurrentDayDetailedForecast from '../helpers/getCurrentDayDetailedForecast';
import getUpcomingDaysForecast from '../helpers/getUpcomingDaysForecast';

//requesting API URLS
const BASE_URL = 'https://www.metaweather.com/api/location';
const CROSS_DOMAIN = 'https://the-ultimate-api-challenge.herokuapp.com';
const REQUEST_URL = `${CROSS_DOMAIN}/${BASE_URL}`;

const useForecast = () => {
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [forecast, setForecast] = useState(null);

    //call the API
    const getWoeid = async isLocation => {
        //1. Get woeid
        //directamente entramos a data con el {data}
        const { data } = await axios(`${REQUEST_URL}/search`, { params: { query: isLocation } });
        //2. Get weather
        if (!data || data.length === 0) {
            //set an error
            setError('There is not such location');
            setLoading(false);
            return;
        }

        return data[0];
    };

    const getForecastData = async woeid => {
        const {data} = await axios(`${REQUEST_URL}/${woeid}`);
        //si tenemos la locacion pero no nos llegan los datos x algun motivo    
        if(!data || data.length === 0){
            setError('Something went wrong');
            setLoading(false);
            return;
        }
        return data;
    };

    const gatherForecastData = (data) => {
        const currentDay = getCurrentDayForecast(data.consolidated_weather[0], data.title);
        const currentDayDetails = getCurrentDayDetailedForecast(data.consolidated_weather[0]);
        const upcomingDays = getUpcomingDaysForecast(data.consolidated_weather);

        setForecast({ currentDay, currentDayDetails, upcomingDays});
        setLoading(false); 
    }

    const submitRequest = async isLocation => {
        //loader para la info
        setLoading(true);
        setError(false);

        const response = await getWoeid(isLocation);
        if(!response?.woeid) return;

        const data = await getForecastData(response.woeid);
        if(!data) return;


        gatherForecastData(data);
    };

    return {
        isError,
        isLoading,
        forecast,
        submitRequest,
    };
};

export default useForecast;
