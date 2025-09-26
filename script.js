// 🌐 REPLACE WITH YOUR OPENWEATHERMAP API KEY
const API_KEY = '42234a1bda133fc97f5de9650d39cd02';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locateBtn = document.getElementById('locate-btn');
const retryBtn = document.getElementById('retry-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessageEl = document.getElementById('error-message');
const currentWeatherDiv = document.getElementById('current-weather');
const hourlyContainer = document.getElementById('hourly-container');
const dailyContainer = document.getElementById('daily-container');
const locationEl = document.getElementById('location');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const iconEl = document.getElementById('weather-icon');
const body = document.body;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
locateBtn.addEventListener('click', handleLocation);
retryBtn.addEventListener('click', retryLastAction);

let lastAction = null;

function handleSearch() {
  const city = cityInput.value.trim();
  if (city) {
    lastAction = () => getWeatherByCity(city);
    getWeatherByCity(city);
  } else {
    showError('Please enter a city name.');
  }
}

function handleLocation() {
  if (navigator.geolocation) {
    showLoading();
    lastAction = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          hideLoading();
          showError('Please allow location access.');
        }
      );
    };
    lastAction();
  } else {
    showError('Geolocation not supported.');
  }
}

function retryLastAction() {
  if (lastAction) {
    lastAction();
  }
}

// UI Functions
function showLoading() {
  loadingDiv.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  currentWeatherDiv.classList.add('hidden');
  document.getElementById('hourly-forecast').classList.add('hidden');
  document.getElementById('daily-forecast').classList.add('hidden');
  hourlyContainer.innerHTML = '';
  dailyContainer.innerHTML = '';
}

function hideLoading() {
  loadingDiv.classList.add('hidden');
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorDiv.classList.remove('hidden');
  hideLoading();
}

function clearError() {
  errorDiv.classList.add('hidden');
}

// Weather Functions
async function getWeatherByCity(city) {
  showLoading();
  clearError();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=en`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    updateBackground(data.weather[0].main, data.dt, data.sys.sunrise, data.sys.sunset);
    displayCurrentWeather(data);
    getForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    hideLoading();
    showError(error.message === 'City not found' ? 'City not found. Check spelling.' : 'Network error. Check connection.');
  }
}

async function getWeatherByCoords(lat, lon) {
  clearError();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`
    );

    if (!response.ok) throw new Error('Weather unavailable');

    const data = await response.json();
    updateBackground(data.weather[0].main, data.dt, data.sys.sunrise, data.sys.sunset);
    displayCurrentWeather(data);
    getForecast(lat, lon);
  } catch (error) {
    hideLoading();
    showError('Failed to get weather for your location.');
  }
}

async function getForecast(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`
    );

    if (!response.ok) throw new Error('Forecast unavailable');

    const data = await response.json();
    displayHourlyForecast(data.list);
    displayDailyForecast(data.list);

    hideLoading();
    currentWeatherDiv.classList.remove('hidden');
    document.getElementById('hourly-forecast').classList.remove('hidden');
    document.getElementById('daily-forecast').classList.remove('hidden');
  } catch (error) {
    hideLoading();
    showError('Failed to load forecast.');
  }
}

// Dynamic Background Based on Weather & Time
function updateBackground(weatherMain, currentTime, sunrise, sunset) {
  const bodyClasses = ['weather-sunny', 'weather-rainy', 'weather-cloudy', 'weather-stormy', 'weather-snowy', 'weather-night'];
  bodyClasses.forEach(cls => body.classList.remove(cls));

  // Check if it's night
  if (currentTime < sunrise || currentTime > sunset) {
    body.classList.add('weather-night');
    return;
  }

  // Weather-based classes
  if (weatherMain.includes('Rain') || weatherMain.includes('Drizzle')) {
    body.classList.add('weather-rainy');
  } else if (weatherMain.includes('Cloud') || weatherMain.includes('Mist') || weatherMain.includes('Fog')) {
    body.classList.add('weather-cloudy');
  } else if (weatherMain.includes('Thunderstorm')) {
    body.classList.add('weather-stormy');
  } else if (weatherMain.includes('Snow')) {
    body.classList.add('weather-snowy');
  } else {
    body.classList.add('weather-sunny');
  }
}

// Display Functions
function displayCurrentWeather(data) {
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°`;
  descEl.textContent = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Bigger icon!
  iconEl.alt = data.weather[0].description;
}

function displayHourlyForecast(list) {
  const next24Hours = list.slice(0, 8);
  hourlyContainer.innerHTML = '';

  next24Hours.forEach((item, index) => {
    const hourItem = document.createElement('div');
    hourItem.classList.add('forecast-item');
    // Stagger animation
    hourItem.style.animationDelay = `${index * 0.1}s`;

    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temp = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const desc = item.weather[0].description;

    hourItem.innerHTML = `
      <p><strong>${time}</strong></p>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" />
      <p class="temp">${temp}°</p>
      <p class="desc">${desc}</p>
    `;

    hourlyContainer.appendChild(hourItem);
  });
}

function displayDailyForecast(list) {
  const dailyData = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) dailyData[date] = item;
  });

  const days = Object.values(dailyData).slice(0, 7);
  dailyContainer.innerHTML = '';

  days.forEach((item, index) => {
    const dayItem = document.createElement('div');
    dayItem.classList.add('forecast-item');
    dayItem.style.animationDelay = `${index * 0.1}s`;

    const date = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const temp = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const desc = item.weather[0].description;

    dayItem.innerHTML = `
      <p><strong>${date}</strong></p>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" />
      <p class="temp">${temp}°</p>
      <p class="desc">${desc}</p>
    `;

    dailyContainer.appendChild(dayItem);
  });
}
