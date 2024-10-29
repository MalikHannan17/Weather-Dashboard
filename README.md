# Weather and Chatbot Forecast Application

This project is a web-based weather forecast and chatbot application. It allows users to retrieve weather forecasts for a given city using the OpenWeather API, filter and sort the forecast data, and ask general questions that are handled by a chatbot integrated with the Gemini API.

## Features
- *Weather Forecast*: 
  - Fetches 5-day weather forecast data for a specific city using the OpenWeather API.
  - Displays weather data in a paginated table.
  - Users can sort and filter weather data based on conditions such as temperature or rainfall.
  
- *Chatbot*:
  - Handles weather-related queries directly by fetching the current weather of a specified city.
  - For general questions, it integrates with the Gemini API to fetch responses.
  
- *Pagination*: 
  - Users can navigate through the forecast data using "Previous" and "Next" buttons.

- *Filter and Sorting*:
  - Sort weather data in ascending or descending order based on temperature.
  - Filter weather data to show only rainy days or display the day with the highest temperature.

## Technologies Used
- *HTML*: Front-end structure for displaying the interface.
- *CSS*: Styling the webpage.
- *JavaScript*: Handles API interactions and DOM manipulation.
- *OpenWeather API*: Provides weather forecast data.
- *Gemini API*: Provides chatbot responses for non-weather-related queries.

## Project Structure

The project consists of four main files:

1. *index.html*:
   - Contains the structure of the webpage including the search bar for city names, the weather table, chatbot input, and control buttons for pagination and filtering.

2. *styles.css*:
   - Contains the styles for the project including layout design, weather table formatting, and chatbot appearance.

3. *script.js*:
   - Manages event listeners and user interaction.
   - Handles API calls to OpenWeather and Gemini for weather and chatbot responses, respectively.
   - Manages pagination, sorting, and filtering of weather data.
  
4. *table.js*:
   - Specifically handles the logic for rendering the weather forecast table, including pagination, sorting, and filtering functionality.

## Prerequisites
Before running this project, make sure you have the following:
- A valid API key from [OpenWeather](https://openweathermap.org/) to fetch weather data.
- A valid API key from [Gemini API](https://developers.generativelanguage.googleapis.com) for chatbot responses.
  
## Setup Instructions

1. Clone the repository or download the project files:
   ```bash
   git clone <repository-url>
   cd weather-chatbot-app


### Instructions Summary:
1. Clone the project.
2. Add your OpenWeather and Gemini API keys to script.js.
3. Open index.html in a browser to run the application.

This file provides an overview of the project, its features, setup instructions, usage guide, and necessary API keys for the app to function correctly.