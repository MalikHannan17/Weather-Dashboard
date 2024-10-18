// Fetch Weather for Tables
document.getElementById('fetch-weather-table').addEventListener('click', function () {
    const city = document.getElementById('input-city').value;
    if (city) {
        fetchWeatherData(city);
    }
});

let weatherData = [];
let filteredData = []; // Separate variable for filtered data
let currentPage = 1;
const rowsPerPage = 10;

function fetchWeatherData(city) {
    const apiKey = '337a615119cb104b0fa3e81455cf349f'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === '200') {
                weatherData = data.list.map(item => ({
                    date: item.dt_txt.split(" ")[0], // Get only the date
                    temp: item.main.temp,
                    condition: item.weather[0].description,
                    windSpeed: item.wind.speed
                }));
                filteredData = [...weatherData]; // Initialize filteredData with the complete weatherData
                renderTable();
            } else {
                alert('City not found!');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert(`Error fetching weather data: ${error.message}. Please check your API key or network connection.`);
        });
}


function renderTable() {
    const tbody = document.getElementById('weather-table').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing table data

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex); // Use filteredData for pagination

    paginatedData.forEach(item => {
        const row = `
            <tr>
                <td>${item.date}</td>
                <td>${item.temp}Â°C</td>
                <td>${item.condition}</td>
                <td>${item.windSpeed} m/s</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const pageInfo = document.getElementById('page-info');
    const totalPages = Math.ceil(filteredData.length / rowsPerPage); // Use filteredData for pagination
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Pagination Controls
document.getElementById('prev-page').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('next-page').addEventListener('click', function () {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage); // Use filteredData for pagination
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Filter functions
document.getElementById('sort-asc').addEventListener('click', sortTemperaturesAscending);
document.getElementById('sort-desc').addEventListener('click', sortTemperaturesDescending);
document.getElementById('filter-rainy').addEventListener('click', filterRainyDays);
document.getElementById('highest-temp').addEventListener('click', showHighestTemperature);

function filterRainyDays() {
    const rainyDays = weatherData.filter(item => item.condition.includes('rain')); // Filter from the original weatherData

    if (rainyDays.length > 0) {
        filteredData = rainyDays; // Set filteredData to rainy days
    } else {
        alert('No rainy days found. Showing all data.'); // Alert if no rainy days found
        filteredData = [...weatherData]; // Reset to original data
    }
    
    currentPage = 1; // Reset to first page
    renderTable();
}

function sortTemperaturesAscending() {
    filteredData.sort((a, b) => a.temp - b.temp); // Sort filteredData
    currentPage = 1; // Reset to first page
    renderTable();
}

function sortTemperaturesDescending() {
    filteredData.sort((a, b) => b.temp - a.temp); // Sort filteredData
    currentPage = 1; // Reset to first page
    renderTable();
}

function showHighestTemperature() {
    // Find the highest temperature
    if (filteredData.length === 0) return; // Check if there's data to show

    const highestTempDay = filteredData.reduce((prev, current) => (prev.temp > current.temp) ? prev : current, filteredData[0]);
    
    // Clear existing highest temperature row if it exists
    const tbody = document.getElementById('weather-table').querySelector('tbody');
    const existingHighestRow = tbody.querySelector('tr.highest-temp-row');
    if (existingHighestRow) {
        existingHighestRow.remove();
    }

    // Create a new row for highest temperature and add it to the table
    const highestRow = `
        <tr class="highest-temp-row">
            <td>${highestTempDay.date}</td>
            <td>${highestTempDay.temp}Â°C</td>
            <td>${highestTempDay.condition}</td>
            <td>${highestTempDay.windSpeed} m/s</td>
        </tr>
    `;
    tbody.innerHTML += highestRow; // Add the highest temperature row
}

// Function to make API request to Gemini chatbot for processing user queries
async function getChatbotReply(userQuery) {
    const apiKey = 'AIzaSyBFqsDvXnyHqDJckzYcxZCwSByhDaqdyG4'; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Create the request payload based on the user's input
    const requestBody = {
        contents: [{ // This structure follows the API requirement based on your curl request
            parts: [{ text: userQuery }]
        }]
    };

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), // Pass request body as a JSON string
        });

        if (!apiResponse.ok) {
            // Log the error details
            const errorDetails = await apiResponse.json();
            console.error("Error details:", errorDetails);
            throw new Error("Failed to fetch API");
        }

        const jsonData = await apiResponse.json();
        // Extracting the chatbot response from the API's response format
        const chatbotReply = jsonData.candidates?.[0]?.content.parts?.[0]?.text || "No response available";
        
        // Process the jsonData as needed (for displaying in the UI)
        displayChatbotResponse(chatbotReply);

    } catch (error) {
        console.error("Error occurred:", error);
        displayError("An error occurred while processing the response.");
    }
}

// Helper function to display chatbot responses in the chat area
function displayChatbotResponse(chatbotReply) {
    const chatResponseDiv = document.getElementById('chat-response');
    // Assuming the response has a format we need to handle
    if (chatbotReply) {
        const replyText = chatbotReply || "Sorry, I couldn't process that.";
        chatResponseDiv.textContent = `Bot: ${replyText}`;
    } else {
        displayError("No valid response found.");
    }
}

// Helper function to display error messages in the chat response area
function displayError(errorMessage) {
    const chatResponseDiv = document.getElementById('chat-response');
    chatResponseDiv.textContent = `Bot: ${errorMessage}`;
}

// Event listener to handle user input and trigger the chatbot response
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');

    // Log to check if the elements are available
    console.log("Chat Input:", chatInput);
    console.log("Send Button:", sendButton);

    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const userMessage = chatInput.value.trim();
            if (userMessage) {
                const chatResponseDiv = document.getElementById('chat-response');
                chatResponseDiv.textContent = `You: ${userMessage}`; // Display user's message

                // Call the function to fetch chatbot response
                getChatbotReply(userMessage);
                chatInput.value = ''; // Clear input after sending
            } else {
                displayError("Please enter a message before sending.");
            }
        });
    } else {
        console.error("Send button not found.");
    }
});
