const moscowCoordinates = {
  latitude: 55.7558,
  longitude: 37.6173,
};

const dateEl = document.getElementById("current-date");
const todaySummaryEl = document.getElementById("today-summary");
const forecastListEl = document.getElementById("forecast-list");

const weatherCodeMap = {
  0: "Ясно",
  1: "Преимущественно ясно",
  2: "Переменная облачность",
  3: "Пасмурно",
  45: "Туман",
  48: "Изморозь",
  51: "Легкая морось",
  53: "Морось",
  55: "Сильная морось",
  61: "Небольшой дождь",
  63: "Дождь",
  65: "Сильный дождь",
  71: "Небольшой снег",
  73: "Снег",
  75: "Сильный снег",
  80: "Ливень",
  81: "Сильный ливень",
  82: "Очень сильный ливень",
  95: "Гроза",
};

function updateCurrentDate() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  dateEl.textContent = `Сегодня: ${formattedDate}`;
}

function formatDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

async function loadWeather() {
  try {
    const params = new URLSearchParams({
      latitude: moscowCoordinates.latitude,
      longitude: moscowCoordinates.longitude,
      daily: "weathercode,temperature_2m_max,temperature_2m_min",
      timezone: "Europe/Moscow",
      forecast_days: "5",
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    if (!response.ok) {
      throw new Error("Не удалось получить данные о погоде");
    }

    const data = await response.json();
    const { time, weathercode, temperature_2m_max: max, temperature_2m_min: min } = data.daily;

    todaySummaryEl.textContent = `${weatherCodeMap[weathercode[0]] ?? "Неизвестно"}. От ${Math.round(
      min[0]
    )}°C до ${Math.round(max[0])}°C.`;

    forecastListEl.innerHTML = "";

    for (let i = 0; i < time.length; i += 1) {
      const item = document.createElement("li");
      item.className = "forecast-item";
      item.innerHTML = `
        <span>${formatDay(time[i])}</span>
        <span>${weatherCodeMap[weathercode[i]] ?? "Неизвестно"}</span>
        <span class="temp">${Math.round(min[i])}°C / ${Math.round(max[i])}°C</span>
      `;
      forecastListEl.appendChild(item);
    }
  } catch (error) {
    todaySummaryEl.textContent = "Ошибка загрузки погоды. Попробуйте позже.";
    forecastListEl.innerHTML = "";
  }
}

updateCurrentDate();
loadWeather();
