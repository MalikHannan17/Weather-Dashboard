// Fetch Weather for Dashboard
document.getElementById('fetch-weather').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const apiKey = '337a615119cb104b0fa3e81455cf349f'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateWeatherWidget(data);
                renderCharts(data);
            } else {
                alert('City not found!');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherWidget(data) {
    const weatherInfo = document.getElementById('weather-info');
    const sideMenu = document.getElementById('side-menu'); // Get the sidebar element
    const city = data.city.name;
    const condition = data.list[0].weather[0].description.toLowerCase();
    const temp = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;
    const icon = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;

    // Update the background of the weather-info div based on the weather condition
    if (condition.includes('rain')) {
        weatherInfo.style.backgroundImage = "url('rain.jpg')";
    } else if (condition.includes('clear')) {
        weatherInfo.style.backgroundImage = "url('clear.jpg')";
    } else if (condition.includes('cloud')) {
        weatherInfo.style.backgroundImage = "url('cloud.jpg')";
    } else if (condition.includes('snow')) {
        weatherInfo.style.backgroundImage = "url('snow.jpg')";
    } else {
        weatherInfo.style.backgroundImage = "url('other.jpg')";
    }

    // Ensure the background covers the div properly
    weatherInfo.style.backgroundSize = 'cover';
    weatherInfo.style.backgroundRepeat = 'no-repeat';

    // Display weather info
    weatherInfo.innerHTML = `
        <h2>${city}</h2>
        <img src="${icon}" alt="Weather icon">
        <p>Temperature: ${temp}Â°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Condition: ${condition}</p>
    `;
}



function renderCharts(data) {
    const temps = data.list.slice(0, 5).map(item => item.main.temp);
    const conditions = data.list.slice(0, 5).map(item => item.weather[0].main);

    // Vertical Bar Chart
    const barCtx = document.getElementById('bar-chart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Temperature (Â°C)',
                data: temps,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                delay: 500
            }
        }
    });

    // Doughnut Chart
    const weatherCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const doughnutCtx = document.getElementById('doughnut-chart').getContext('2d');
    new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(weatherCounts),
            datasets: [{
                label: 'Weather Conditions',
                data: Object.values(weatherCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            }]
        },
        options: {
            animation: {
                delay: 500
            }
        }
    });

    // Line Chart
    const lineCtx = document.getElementById('line-chart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Temperature Change (Â°C)',
                data: temps,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            animation: {
                delay: 500
            }
        }
    });
}

// Fetch Weather for Tables
document.getElementById('fetch-weather-table').addEventListener('click', function () {
    const city = document.getElementById('input-city').value;
    if (city) {
        fetchWeatherDataForTable(city);
    }
});

function fetchWeatherDataForTable(city) {
    const apiKey = '337a615119cb104b0fa3e81455cf349f'; // Replace with your actual OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                populateWeatherTable(data);
            } else {
                alert('City not found!');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function populateWeatherTable(data) {
    const tableBody = document.querySelector('#weather-table tbody');
    tableBody.innerHTML = ''; // Clear any previous data

    for (let i = 0; i < data.list.length; i += 8) { // Every 8th item represents 24 hours later
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        const tempCell = document.createElement('td');
        const conditionCell = document.createElement('td');
        const windCell = document.createElement('td');

        const date = new Date(data.list[i].dt_txt).toLocaleDateString();
        const temp = data.list[i].main.temp;
        const condition = data.list[i].weather[0].description;
        const windSpeed = data.list[i].wind.speed;

        dateCell.textContent = date;
        tempCell.textContent = temp + 'Â°C';
        conditionCell.textContent = condition;
        windCell.textContent = windSpeed + ' m/s';

        row.appendChild(dateCell);
        row.appendChild(tempCell);
        row.appendChild(conditionCell);
        row.appendChild(windCell);

        tableBody.appendChild(row);
    }
}

