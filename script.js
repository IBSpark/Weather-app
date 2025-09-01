// API Configuration
const API_KEY = '897570669b3bb7b38d2f3f225d98f27b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const citySelect = document.getElementById('city-select');
const searchBtn = document.getElementById('search-btn');
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const tempElement = document.getElementById('temp');
const conditionElement = document.getElementById('condition');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const uvElement = document.getElementById('uv');
const forecastContainer = document.querySelector('.forecast-items');

// Pakistani cities with coordinates
const cities = {
    karachi: { name: "Karachi", urdu: "کراچی", lat: 24.8607, lon: 67.0011 },
    hyderabad: { name: "Hyderabad", urdu: "حیدرآباد", lat: 25.3960, lon: 68.3578 },
    lahore: { name: "Lahore", urdu: "لاہور", lat: 31.5204, lon: 74.3587 },
    islamabad: { name: "Islamabad", urdu: "اسلام آباد", lat: 33.6844, lon: 73.0479 },
    peshawar: { name: "Peshawar", urdu: "پشاور", lat: 34.0151, lon: 71.5249 },
    quetta: { name: "Quetta", urdu: "کوئٹہ", lat: 30.1798, lon: 66.9750 },
    multan: { name: "Multan", urdu: "ملتان", lat: 30.1575, lon: 71.5249 },
    faisalabad:   { name: "Faisalabad", urdu: "فیصل آباد", lat: 31.4504, lon: 73.1350 },
    gujranwala:   { name: "Gujranwala", urdu: "گوجرانوالہ", lat: 32.1877, lon: 74.1945 },
    sialkot:      { name: "Sialkot", urdu: "سیالکوٹ", lat: 32.4945, lon: 74.5229 },
    sargodha:     { name: "Sargodha", urdu: "سرگودھا", lat: 32.0836, lon: 72.6711 },
    bahawalpur:   { name: "Bahawalpur", urdu: "بہاولپور", lat: 29.3956, lon: 71.6836 }
};

// Weather icon mapping
const weatherIcons = {
    '01d': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
    '01n': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
    '02d': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
    '02n': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
    '03d': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
    '03n': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
    '04d': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
    '04n': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
    '09d': 'https://cdn-icons-png.flaticon.com/512/4150/4150904.png',
    '09n': 'https://cdn-icons-png.flaticon.com/512/4150/4150904.png',
    '10d': 'https://cdn-icons-png.flaticon.com/512/4150/4150904.png',
    '10n': 'https://cdn-icons-png.flaticon.com/512/4150/4150904.png',
    '11d': 'https://cdn-icons-png.flaticon.com/512/2675/2675997.png',
    '11n': 'https://cdn-icons-png.flaticon.com/512/2675/2675997.png',
    '13d': 'https://cdn-icons-png.flaticon.com/512/6421/6421583.png',
    '13n': 'https://cdn-icons-png.flaticon.com/512/6421/6421583.png',
    '50d': 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png',
    '50n': 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png'
};

// Weather condition translations
const weatherTranslations = {
    'clear sky': 'صاف آسمان',
    'few clouds': 'کچھ بادل',
    'scattered clouds': 'منتشر بادل',
    'broken clouds': 'ٹوٹے ہوئے بادل',
    'shower rain': 'ہلکی بارش',
    'rain': 'بارش',
    'thunderstorm': 'طوفان',
    'snow': 'برف باری',
    'mist': 'دھند',
    'haze': 'دھند'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('karachi');

    searchBtn.addEventListener('click', () => {
        const selectedCity = citySelect.value;
        fetchWeather(selectedCity);
    });
});

// Fetch weather data from API
async function fetchWeather(cityId) {
    const city = cities[cityId];

    try {
        locationElement.innerHTML = `Loading... <span>لوڈ ہو رہا ہے...</span>`;

        const response = await fetch(`${BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === 401) {
            locationElement.innerHTML = `Invalid API Key <span>غلط API کلید</span>`;
            conditionElement.textContent = 'Failed to load weather | موسم لوڈ کرنے میں ناکام';
            return;
        }

        updateCurrentWeather(data, city);
        updateForecast(data, city);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        locationElement.innerHTML = `${city.name}, PK <span>${city.urdu}</span>`;
        conditionElement.textContent = 'Failed to load weather | موسم لوڈ کرنے میں ناکام';
    }
}

// Update current weather UI
function updateCurrentWeather(data, city) {
    locationElement.innerHTML = `${city.name}, PK <span>${city.urdu}</span>`;

    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const englishDate = now.toLocaleDateString('en-US', options);
    const urduDate = now.toLocaleDateString('ur-PK', options);
    dateElement.textContent = `${urduDate} | ${englishDate}`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = weatherIcons[iconCode] || weatherIcons['01d'];
    weatherIcon.alt = data.weather[0].description;

    tempElement.textContent = Math.round(data.main.temp);

    const condition = data.weather[0].description.toLowerCase();
    const translatedCondition = weatherTranslations[condition] || condition;
    conditionElement.textContent = `${data.weather[0].main} / ${translatedCondition}`;

    windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h | ہوا`;
    humidityElement.textContent = `${data.main.humidity}% | نمی`;

    const uvIndex = Math.floor(Math.random() * 5) + 5;
    uvElement.textContent = `${uvIndex} (${getUvLevel(uvIndex)}) | UV`;
}

// Update forecast UI (mock data for demo)
function updateForecast(data, city) {
    forecastContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i);

        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        const urduDay = forecastDate.toLocaleDateString('ur-PK', { weekday: 'short' });

        const tempVariation = (Math.random() * 4) - 2;
        const forecastTemp = Math.round(data.main.temp + tempVariation);

        const conditions = Object.keys(weatherTranslations);
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p class="day">${dayName} | ${urduDay}</p>
            <img src="${weatherIcons[data.weather[0].icon] || weatherIcons['01d']}" alt="${randomCondition}">
            <p class="temp">${forecastTemp}°C</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

// Helper function to get UV level description
function getUvLevel(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
}
