import { T, useTranslate } from "@tolgee/react"; // Importing translation functions from Tolgee
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaDroplet, FaWind } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import "./App.css";
import RippleLoader from "./components/Loader";

// Defining types for weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

// Defining types for forecast data
interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}

interface ChuckNorrisData {
  icon_url: string;
  value: string;
}

function App() {
  // State variables to store city name, weather data, forecast data, loading state, and errors
  const [city, setCity] = useState<string>(""); // City input value
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Current weather data
  const [, setForecastData] = useState<ForecastData | null>(null); // Forecast data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null) // Error message
  const [chuckNorris, setChuckNorris] = useState<ChuckNorrisData | null>(null) // Chuck Norris joke

  const { t } = useTranslate(); // Tolgee translation hook

  // Function to fetch weather and forecast data from OpenWeather API
  const fetchWeatherData = async (cityName: string) => {
    const apiKey = "6aa1b1b98ae89bb4e3b5dfdbfd2ca861"; // Fetching the API key from environment variables
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`; // API URL for current weather
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`; // API URL for 3-day forecast

    try {
      setLoading(true); // Setting loading state
      setError(null); // Resetting error state

      // Fetching current weather data
      const weatherResponse = await fetch(currentWeatherUrl);
      if (!weatherResponse.ok) {
        throw new Error("City not found! Try another one"); // Error if city not found
      }
      const weatherData: WeatherData = await weatherResponse.json(); // Parsing weather data
      setWeatherData(weatherData); // Setting the fetched weather data
      console.log(weatherData);

      // Fetching forecast data
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error("Unable to fetch forecast data"); // Error if forecast data not available
      }
      const forecastData: ForecastData = await forecastResponse.json(); // Parsing forecast data
      setForecastData(forecastData); // Setting the fetched forecast data
    } catch (error) {
      // Handling any errors that occur during the fetch
      if (error instanceof Error) {
        setError(error.message); // Displaying error message
      }
      setWeatherData(null); // Resetting weather data
      setForecastData(null); // Resetting forecast data
    } finally {
      setLoading(false); // Resetting loading state
    }
  };

  // Handling form submission to fetch weather data based on city input
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeatherData(city);
    fetchChuckNorris();
    setCity("");
  };

  const fetchChuckNorris = async () => {
    const url = "https://api.chucknorris.io/jokes/random";
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch Chuck Norris joke");
      }
      const chuckNorrisData = await response.json();
      setChuckNorris(chuckNorrisData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setChuckNorris(null);
    } finally {
      setLoading(false);
    }
  }


  const handleLocaleWeather = () => {
      const getUserLocation = async () => {
        if (navigator.geolocation) {
          // Checking if geolocation is available
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords; // Getting user's device location
              const apiKey = "6aa1b1b98ae89bb4e3b5dfdbfd2ca861";
              const reverseGeocodeUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`; // API URL for reverse geocoding (get location by lat/lon

              try {
                setLoading(true);
                const response = await fetch(reverseGeocodeUrl); // Fetching weather data by geolocation
                if (!response.ok) {
                  throw new Error("Unable to fetch location data"); // Error if location data fetch fails
                }
                const data: WeatherData = await response.json(); // Parsing weather data
                setWeatherData(data); // Setting the fetched weather data
                setCity(data.name); // Setting the city based on fetched location
                await fetchWeatherData(data.name); // Fetching weather data for the fetched city
                await fetchChuckNorris();
              } catch (error) {
                // Handling any errors that occur during the fetch
                if (error instanceof Error) {
                  setError(error.message); // Displaying error message
                }
                setWeatherData(null); // Resetting weather data
                setForecastData(null); // Resetting forecast data
              } finally {
                setLoading(false); // Resetting loading state
              }
            },
            () => {
              // Handling geolocation errors (e.g., if user denies location access)
              setError("Unable to retrieve your location");
              setWeatherData(null);
              setForecastData(null);
            }
          );
        } else {
          // Handling case where geolocation is not supported by the browser
          setError("Geolocation is not supported by this browser.");
          setWeatherData(null);
          setForecastData(null);
        }
      };

      getUserLocation(); // Invoking the function to get user location on page load
  }

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen px-3">
        {/* <LanguageSelect /> */}
        <div className="mt-3 bg-slate-400/50 rounded shadow-lg border border-white/30 p-5 w-full md:w-[350px]">
          <div>
            <form className="flex gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="search"
                placeholder={t("search_city", "Search City")} // Translation for placeholder text
                className="w-full px-4 py-2 border rounded-full text-white/70 bg-[#668ba0] focus:outline-none border-transparent focus:border-[#668ba0]"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button type="submit" className="">
                <BiSearch className="text-white/70" size={20} />
              </button>
              <button type="button" onClick={handleLocaleWeather} className="">
                Lokales Wetter
              </button>
            </form>
          </div>

          {loading && (
            <div className="flex justify-center items-center">
              <RippleLoader />
            </div>
          )}
          {error && (
            <p className="text-red-600 font-bold flex justify-center items-center">
              {error}
            </p>
          )}

          {!error && weatherData && (
            <div>
              {/* Displaying current weather data */}
              <div className="flex justify-between items-center text-white font-bold">
                <span className="flex-col items-center gap-x-2">
                  <span className="flex items-center gap-x-2">
                  <FaMapMarkerAlt size={20} />
                    <p className="text-xl font-serif">{weatherData.name}</p>
                  </span>
                  <span className="flex items-center gap-x-2">
                  <CiGlobe size={20} />
                    <p className="text-xl font-serif">{weatherData.sys.country}</p>
                    </span>
                </span>

                <div className="flex flex-col items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />{" "}
                  {/* Weather icon */}
                  <span>
                    <p className="text-6xl font-bold text-white">
                      {Math.round(weatherData.main.temp)} °C
                    </p>
                  </span>
                </div>
              </div>

              <div className="my-5 flex justify-between items-center">
                {/* Humidity */}
                <div className="flex items-center gap-x-3">
                  <FaDroplet size={30} className="text-white/90" />
                  <span>
                    <p className="text-lg font-serif text-white font-bold">
                      <T keyName="humidity">Luftfeuchtigkeit</T>
                    </p>
                    <p className="text-lg font-medium text-white/90">
                      {weatherData.main.humidity}%
                    </p>
                  </span>
                </div>

                {/* Wind Speed */}
                <div className="flex w-1/2 items-center gap-x-3">
                  <FaWind size={30} className="text-white/90" />
                  <span>
                    <p className="text-lg font-serif text-white font-bold">
                      <T keyName="wind_speed">Wind Geschwindigkeit</T>
                    </p>
                    <p className="text-lg font-medium text-white/90">
                      {weatherData.wind.speed} km/h
                    </p>
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img src={chuckNorris?.icon_url} alt="Chuck Norris" className="mr-3" />
                <p className="text-lg font-serif text-white/90">
                  {chuckNorris?.value}
                </p>
                </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
