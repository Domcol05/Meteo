// --- CONFIGURAZIONE ---
const apiKey = "7481fb7a6222588ba8114897e1134302"; // <--- INCOLLA QUI LA TUA API KEY

const currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=it&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=it&q=";

// --- ELEMENTI DEL DOM ---
const searchBox = document.querySelector(".city-search");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".icon");
const hourlyContainer = document.querySelector(".hourly-scroll");

// --- FUNZIONE PRINCIPALE ---
async function getFullWeather(city) {
    if (!city) {
        alert("Per favore, inserisci un nome di città.");
        return;
    }
    
    // UI: Mostra caricamento, nascondi dati
    document.querySelector(".weather-loading").classList.remove("hide");
    document.querySelector(".weather-data").classList.add("hide");
    document.querySelector(".hourly-container").classList.add("hide");

    // Eseguiamo le chiamate. Se current fallisce, forecast non parte.
    const currentSuccess = await checkCurrentWeather(city);
    
    if (currentSuccess) {
        await checkForecast(city);
        // UI: Tutto pronto, mostra i dati
        document.querySelector(".weather-loading").classList.add("hide");
        document.querySelector(".weather-data").classList.remove("hide");
    } else {
        document.querySelector(".weather-loading").classList.add("hide");
    }
}

// --- 1. METEO ATTUALE ---
async function checkCurrentWeather(city) {
    try {
        const response = await fetch(currentApiUrl + city + `&appid=${apiKey}`);
        
        if (response.status === 404) {
            alert("Città non trovata! Controlla il nome.");
            return false;
        }

        const data = await response.json();

        // Aggiorna DOM
        document.querySelector(".city").innerText = data.name;
        document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerText = data.main.humidity + "%";
        document.querySelector(".wind").innerText = data.wind.speed + " km/h";
        document.querySelector(".description").innerText = data.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        return true; // Successo

    } catch (error) {
        console.error("Errore Current Weather:", error);
        alert("Errore di connessione o API Key non valida.");
        return false;
    }
}

// --- 2. PREVISIONI ORARIE (FORECAST) ---
async function checkForecast(city) {
    try {
        const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        // Pulisci vecchie previsioni
        hourlyContainer.innerHTML = "";
        
        // OpenWeather dà previsioni ogni 3 ore. Prendiamo le prime 8 (24 ore totali)
        const nextHours = data.list.slice(0, 8);

        nextHours.forEach(item => {
            const dateObj = new Date(item.dt_txt);
            const hour = dateObj.getHours() + ":00";
            const temp = Math.round(item.main.temp) + "°";
            const icon = item.weather[0].icon;

            // Template HTML per la card oraria
            const cardHTML = `
                <div class="hourly-card">
                    <span>${hour}</span>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Meteo">
                    <span>${temp}</span>
                </div>
            `;
            
            hourlyContainer.innerHTML += cardHTML;
        });

        document.querySelector(".hourly-container").classList.remove("hide");

    } catch (error) {
        console.error("Errore Forecast:", error);
        // Non blocchiamo tutto se fallisce solo il forecast
    }
}

// --- EVENT LISTENERS ---
searchBtn.addEventListener("click", () => getFullWeather(searchBox.value));

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getFullWeather(searchBox.value);
});

// Avvio automatico
getFullWeather("Monte di Procida");
