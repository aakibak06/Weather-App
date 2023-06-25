import axios from "axios";



const ApiKey = '19e25fc838724daaa1d185351231806';

const forecastEndPoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const LocationEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${ApiKey}&q=${params.cityName}`

// console.log(LocationEndPoint)
const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
    }
    try {
        const response = await axios.request(options)
        return response.data;
    }
    catch (error) {
        console.log('error', error)
        return null
    }
}

export const fetchweatherForecaste = (params) => {
    return apiCall(forecastEndPoint(params));
}

export const fetchlocation = (params) => {
    return apiCall(LocationEndPoint(params));
}




