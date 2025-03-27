"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiDroplet, FiWind, FiSunrise, FiSunset, FiThermometer, FiMapPin } from "react-icons/fi";
import { WiHumidity, WiBarometer } from "react-icons/wi";
import { TbUvIndex } from "react-icons/tb";

interface WeatherData {
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

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  if (!data) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const now = new Date().getTime() / 1000;
  const isDaytime = now > data.sunrise && now < data.sunset;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto weather-card-container"
    >
      <div className="glass-effect overflow-hidden">
        <div className="weather-gradient text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="weatherPattern" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"></path>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#weatherPattern)"></rect>
            </svg>
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <motion.div variants={itemVariants}>
              <div className="flex items-center">
                <FiMapPin className="mr-2" />
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {data.city}
                </h2>
              </div>
              <p className="text-sm opacity-90 mt-1 ml-6">
                {data.country}
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="text-right"
            >
              <div className="text-4xl sm:text-5xl font-bold flex items-start">
                {Math.round(data.temperature)}
                <span className="text-3xl">°C</span>
              </div>
              <p className="text-sm opacity-90 capitalize">{data.description}</p>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex items-center justify-between"
          >
            <div className="flex items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} 
                alt={data.description}
                className="w-16 h-16 mr-2 drop-shadow-lg"
              />
              <div>
                <p className="text-sm">Gefühlt wie</p>
                <p className="text-xl font-medium">{Math.round(data.feelsLike)}°C</p>
              </div>
            </div>
            
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-xs uppercase tracking-wider opacity-80">
                {isDaytime ? 'Tag' : 'Nacht'}
              </div>
              <div className="text-sm mt-1">
                {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-primary/5 p-3 rounded-xl"
          >
            <WiHumidity className="text-3xl text-info mb-2" />
            <p className="text-xs text-secondary">Luftfeuchtigkeit</p>
            <p className="font-medium text-lg">{data.humidity}%</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-info/5 p-3 rounded-xl"
          >
            <FiWind className="text-2xl text-info mb-2" />
            <p className="text-xs text-secondary">Wind</p>
            <p className="font-medium text-lg">{data.windSpeed} km/h</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-primary/5 p-3 rounded-xl"
          >
            <WiBarometer className="text-3xl text-info mb-2" />
            <p className="text-xs text-secondary">Luftdruck</p>
            <p className="font-medium text-lg">{data.pressure} hPa</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-info/5 p-3 rounded-xl"
          >
            <FiThermometer className="text-2xl text-info mb-2" />
            <p className="text-xs text-secondary">UV-Index</p>
            <p className="font-medium text-lg">{data.uvi || 0}</p>
          </motion.div>
        </div>

        <div className="p-6 sm:p-8 pt-0 sm:pt-0 grid grid-cols-2 gap-4">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center bg-primary/5 p-3 rounded-xl"
          >
            <FiSunrise className="text-xl text-amber-500 mr-3" />
            <div>
              <p className="text-xs text-secondary">Sonnenaufgang</p>
              <p className="font-medium">{formatTime(data.sunrise)}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center bg-info/5 p-3 rounded-xl"
          >
            <FiSunset className="text-xl text-orange-500 mr-3" />
            <div>
              <p className="text-xs text-secondary">Sonnenuntergang</p>
              <p className="font-medium">{formatTime(data.sunset)}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
