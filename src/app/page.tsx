"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import { getWeatherByCity, WeatherData } from "@/services/weatherService";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="animated-bg"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 mt-8 sm:mt-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
          Wetter App
        </h1>
        <p className="text-secondary mt-2 max-w-md mx-auto">
          Geben Sie eine Stadt ein, um aktuelle Wetterdaten zu erhalten
        </p>
      </motion.div>

      <div className="w-full max-w-md mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loader"
          />
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect p-6 rounded-xl text-center"
          >
            <p className="text-red-500">{error}</p>
            <p className="mt-2 text-secondary">Bitte versuchen Sie es mit einer anderen Stadt.</p>
          </motion.div>
        ) : weatherData ? (
          <motion.div
            key="weather"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl"
          >
            <WeatherCard data={weatherData} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
