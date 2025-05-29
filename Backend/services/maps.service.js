// maps.service.js
const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = ` https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Geocoding error:', response.data.status, response.data.error_message);
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch coordinates');
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_KEY;
      const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];
            if (element.status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }
            return element;
        } else {
            console.error('Distance Matrix error:', response.data.status, response.data.error_message);
            throw new Error('Unable to fetch distance and time');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};


module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

      const apiKey = process.env.GOOGLE_MAPS_KEY;  
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}










// module.exports.getAutoCompleteSuggestions = async (input) => {
//     if (!input) {
//         throw new Error('Query parameter "input" is required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_KEY;  
//     const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);

//         if (response.data.status === 'OK') {
//             // Extract descriptions from predictions and return
//             return response.data.predictions
//                 .map(prediction => prediction.description)
//                 .filter(desc => desc && desc.length > 0);
//         } else {
//             // API returned error status
//             throw new Error(`API Error: ${response.data.status} - ${response.data.error_message || 'No message'}`);
//         }
//     } catch (err) {
//         console.error('Autocomplete API call failed:', err.message || err);
//         throw err;
//     }
// };




module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ ltd, lng], radius / 6371]
            }
        }
    });

    return captains;
};
