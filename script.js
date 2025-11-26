// CONFIGURAZIONE
// INCOLLA QUI LA TUA API KEY PERSONALE DI OPENWEATHERMAP
const apiKey = "7481fb7a6222588ba8114897e1134302"; 

const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=it&q=";

// SELEZIONE ELEMENTI DOM
const searchBox = document.querySelector(".city-search");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".icon");

// Funzione principale asincrona
async function checkWeather(city) {
    // Controllo se l'utente ha scritto qualcosa
    if (!city) {
        alert("Inserisci il nome di una città!");
        return;
    }

    try {
        // Mostra stato di caricamento
        document.querySelector(".weather-loading").classList.remove("hide");
        document.querySelector(".weather-data").classList.add("hide");

        // Chiamata Fetch alla API
        const response = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);

        // Gestione errori (es. Città non trovata)
        if (response.status === 404) {
            document.querySelector(".weather-loading").classList.add("hide");
            alert("Città non trovata! Controlla lo spelling.");
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore API: ${response.status}`);
        }

        // Parsing dei dati
        const data = await response.json();
        console.log("Dati meteo:", data);

        // Aggiornamento Interfaccia (DOM)
        document.querySelector(".city").innerText = data.name;
        document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerText = data.main.humidity + "%";
        document.querySelector(".wind").innerText = data.wind.speed + " km/h";
        document.querySelector(".description").innerText = data.weather[0].description;

        // Gestione Icona Meteo
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        // Mostra i risultati
        document.querySelector(".weather-loading").classList.add("hide");
        document.querySelector(".weather-data").classList.remove("hide");

    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore. Controlla la Console (F12) e la tua API Key.");
        document.querySelector(".weather-loading").classList.add("hide");
    }
}

// EVENT LISTENERS (Gestione Click e Tasto Invio)

// 1. Click sul bottone lente d'ingrandimento
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// 2. Pressione del tasto "Invio" sulla tastiera
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Caricamento iniziale (Default)
checkWeather("Monte di Procida");