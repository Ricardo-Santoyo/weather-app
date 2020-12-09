const searchInput = document.querySelector('#search-input');
const loader = document.querySelector('#wrapper');
let k;
let k2;

searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    getWeather();
  }
});

async function getWeather() {
  try {
    loader.style.display = 'block';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=7478bbbab383caab6788668ddf08c215`, {mode:'cors'});
    const jsonData = await response.json();
    const weatherData = processData(jsonData);
    loader.style.display = 'none';
    k = weatherData.temp;
    k2 = weatherData.feelsLike;
    displayWeather(weatherData);
  } catch {
    loader.style.display = 'none';
    errorMessage();
  }
};

function errorMessage() {
  document.querySelector('#error').textContent = 'No matching location found!';
};

function processData(data) {
  return {
    name: data.name,
    country: data.sys.country,
    condition: data.weather[0].main,
    temp: data.main.temp,
    icon: data.weather[0].icon,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
  }
};

function displayWeather(data) {
  document.querySelector('#error').textContent = '';
  let weatherInfo = document.querySelector('#weather-info');
  weatherInfo.style.padding = "25px";
  weatherInfo.textContent = '';
  let name = document.createElement('h2');
  name.textContent = `${data.name}, ${data.country}`;
  let condition = document.createElement('h3');
  condition.textContent = data.condition;
  let temp = document.createElement('h1');
  temp.textContent = fahrenheit(data.temp);
  let unit = document.createElement('span');
  unit.textContent = '°F'
  temp.appendChild(unit);
  let icon = document.createElement('img');
  icon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
  let p1 = document.createElement('p');
  p1.textContent = `Feels Like: ${fahrenheit(data.feelsLike)}°F`;
  p1.className = 'temp';
  let p2 = document.createElement('p');
  p2.textContent = `Humidity: ${data.humidity}%`;
  let p3 = document.createElement('p');
  p3.textContent = `Wind Speed: ${Math.round(data.windSpeed * 2.237)} MPH`;
  let toggle = createToggle();

  weatherInfo.appendChild(name);
  weatherInfo.appendChild(condition);
  weatherInfo.appendChild(temp);
  weatherInfo.appendChild(icon);
  weatherInfo.appendChild(p1);
  weatherInfo.appendChild(p2);
  weatherInfo.appendChild(p3);
  weatherInfo.appendChild(toggle);
};

function createToggle() {
  let label = document.createElement('label');
  let input = document.createElement('input');
  let span = document.createElement('span');
  let f = document.createElement('span');
  let c = document.createElement('span');
  f.textContent = 'F';
  c.textContent = 'C';
  label.className = "switch";
  input.type = "checkbox";
  span.className = "slider";
  span.appendChild(f);
  span.appendChild(c);
  label.appendChild(input);
  label.appendChild(span);
  input.addEventListener('click', toggleTemp);
  return label;
};

function fahrenheit(temp) {
  return Math.round((temp - 273.15) * 9/5 + 32);
};

function celsius(temp) {
  return Math.round(temp - 273.15);
};

function toggleTemp() {
  let temp = document.querySelector('h1');
  let unit = document.querySelector('h1 span');
  let temp2 = document.querySelector('.temp');
  
  if (unit.textContent === '°F') {
    temp.textContent = celsius(k);
    unit.textContent = '°C'
    temp.appendChild(unit);
    temp2.textContent = `Feels Like: ${celsius(k2)}°C`;
  } else {
    temp.textContent = fahrenheit(k);
    unit.textContent = '°F'
    temp.appendChild(unit);
    temp2.textContent = `Feels Like: ${fahrenheit(k2)}°F`;
  }
};