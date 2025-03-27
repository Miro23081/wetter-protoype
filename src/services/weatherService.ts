import axios from 'axios';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const IP_API_URL = 'http://ip-api.com/json';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  uvi?: number;
}

export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const getUserLocationByIP = async (): Promise<LocationData> => {
  try {
    const response = await axios.get(IP_API_URL);
    const data = response.data;
    
    if (data.status === 'success') {
      return {
        city: data.city,
        country: data.country,
        lat: data.lat,
        lon: data.lon
      };
    }
    throw new Error('Standort konnte nicht ermittelt werden');
  } catch (error) {
    console.error('Fehler bei der IP-Geolokalisierung:', error);
    throw error;
  }
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const geoResponse = await axios.get(`${GEO_BASE_URL}/search`, {
      params: {
        name: city,
        count: 1,
        language: 'de',
        format: 'json'
      }
    });
    
    if (geoResponse.data.results && geoResponse.data.results.length > 0) {
      const location = geoResponse.data.results[0];
      
      return getWeatherByCoordinates(
        location.latitude, 
        location.longitude, 
        location.name, 
        location.country
      );
    } else {
      throw new Error('Stadt nicht gefunden');
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
    throw error;
  }
};

export const getWeatherByCoordinates = async (
  lat: number, 
  lon: number, 
  cityName?: string, 
  countryName?: string
): Promise<WeatherData> => {
  try {
    const weatherResponse = await axios.get(WEATHER_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
        timezone: 'auto',
        forecast_days: 1
      }
    });
    
    const data = weatherResponse.data;
    const current = data.current;
    
    let city = cityName || 'Unbekannt';
    let country = countryName || '';
    
    if (!cityName || !countryName) {
      try {
        const reverseGeoResponse = await axios.get(`${GEO_BASE_URL}/reverse`, {
          params: {
            latitude: lat,
            longitude: lon,
            language: 'de',
            format: 'json'
          }
        });
        
        if (reverseGeoResponse.data.results && reverseGeoResponse.data.results.length > 0) {
          const location = reverseGeoResponse.data.results[0];
          city = location.name || city;
          country = location.country || country;
        }
      } catch (error) {
        console.error('Fehler beim Reverse Geocoding:', error);
      }
    }
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const sunrise = new Date(year, month, day, 6, 0).getTime() / 1000;
    const sunset = new Date(year, month, day, 20, 0).getTime() / 1000;
    
    const isDay = current.is_day === 1;
    const { description, icon } = getWeatherCondition(current.weather_code, isDay);
    
    return {
      city,
      country,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      description,
      icon,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      pressure: current.surface_pressure,
      sunrise,
      sunset,
      uvi: 0
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
    throw error;
  }
};

const getWeatherCondition = (code: number, isDay: boolean) => {
  const conditions: Record<number, { description: string, icon: string }> = {
    0: { description: "Klar", icon: isDay ? "01d" : "01n" },
    1: { description: "Überwiegend klar", icon: isDay ? "01d" : "01n" },
    2: { description: "Teilweise bewölkt", icon: isDay ? "02d" : "02n" },
    3: { description: "Bewölkt", icon: isDay ? "03d" : "03n" },
    45: { description: "Nebel", icon: isDay ? "50d" : "50n" },
    48: { description: "Reifnebel", icon: isDay ? "50d" : "50n" },
    51: { description: "Leichter Nieselregen", icon: isDay ? "09d" : "09n" },
    53: { description: "Mäßiger Nieselregen", icon: isDay ? "09d" : "09n" },
    55: { description: "Starker Nieselregen", icon: isDay ? "09d" : "09n" },
    56: { description: "Leichter gefrierender Nieselregen", icon: isDay ? "09d" : "09n" },
    57: { description: "Starker gefrierender Nieselregen", icon: isDay ? "09d" : "09n" },
    61: { description: "Leichter Regen", icon: isDay ? "10d" : "10n" },
    63: { description: "Mäßiger Regen", icon: isDay ? "10d" : "10n" },
    65: { description: "Starker Regen", icon: isDay ? "10d" : "10n" },
    66: { description: "Leichter gefrierender Regen", icon: isDay ? "13d" : "13n" },
    67: { description: "Starker gefrierender Regen", icon: isDay ? "13d" : "13n" },
    71: { description: "Leichter Schneefall", icon: isDay ? "13d" : "13n" },
    73: { description: "Mäßiger Schneefall", icon: isDay ? "13d" : "13n" },
    75: { description: "Starker Schneefall", icon: isDay ? "13d" : "13n" },
    77: { description: "Schneegriesel", icon: isDay ? "13d" : "13n" },
    80: { description: "Leichte Regenschauer", icon: isDay ? "09d" : "09n" },
    81: { description: "Mäßige Regenschauer", icon: isDay ? "09d" : "09n" },
    82: { description: "Starke Regenschauer", icon: isDay ? "09d" : "09n" },
    85: { description: "Leichte Schneeschauer", icon: isDay ? "13d" : "13n" },
    86: { description: "Starke Schneeschauer", icon: isDay ? "13d" : "13n" },
    95: { description: "Gewitter", icon: isDay ? "11d" : "11n" },
    96: { description: "Gewitter mit leichtem Hagel", icon: isDay ? "11d" : "11n" },
    99: { description: "Gewitter mit starkem Hagel", icon: isDay ? "11d" : "11n" }
  };

  return conditions[code] || { description: "Unbekannt", icon: isDay ? "01d" : "01n" };
};
