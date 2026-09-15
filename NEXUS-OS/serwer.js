const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const HOST = "127.0.0.1";
const INDEX = path.join(__dirname, "index.html");

// ========================================
// NEXUS OS SERVER
// ========================================

function sendJson(res, status, data) {
    const body = JSON.stringify(data);

    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });

    res.end(body);
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";

        req.on("data", chunk => {
            data += chunk;
        });

        req.on("end", () => {
            resolve(data);
        });

        req.on("error", reject);
    });
}

// ========================================
// 🌦️ MODUŁ POGODY
// ========================================

const CITIES = {
    wroclaw: {
        name: "Wrocław",
        latitude: 51.1079,
        longitude: 17.0385
    },

    warszawa: {
        name: "Warszawa",
        latitude: 52.2297,
        longitude: 21.0122
    },

    krakow: {
        name: "Kraków",
        latitude: 50.0647,
        longitude: 19.9450
    },

    poznan: {
        name: "Poznań",
        latitude: 52.4064,
        longitude: 16.9252
    },

    gdansk: {
        name: "Gdańsk",
        latitude: 54.3520,
        longitude: 18.6466
    },

    lodz: {
        name: "Łódź",
        latitude: 51.7592,
        longitude: 19.4560
    },

    zgorzelec: {
        name: "Zgorzelec",
        latitude: 51.1494,
        longitude: 15.0084
    }
};

function weatherDescription(code) {
    const descriptions = {
        0: "Bezchmurnie ☀️",
        1: "Przeważnie bezchmurnie 🌤️",
        2: "Częściowe zachmurzenie ⛅",
        3: "Pochmurno ☁️",
        45: "Mgła 🌫️",
        48: "Mgła 🌫️",
        51: "Lekka mżawka 🌦️",
        53: "Mżawka 🌦️",
        55: "Silna mżawka 🌧️",
        61: "Lekki deszcz 🌦️",
        63: "Deszcz 🌧️",
        65: "Silny deszcz 🌧️",
        71: "Lekki śnieg 🌨️",
        73: "Śnieg ❄️",
        75: "Silny śnieg ❄️",
        80: "Przelotne opady 🌦️",
        81: "Przelotny deszcz 🌧️",
        82: "Silne przelotne opady 🌧️",
        95: "Burza ⛈️",
        96: "Burza z gradem ⛈️",
        99: "Silna burza z gradem ⛈️"
    };

    return descriptions[code] || "Nieznane warunki pogodowe";
}

function normalizeCity(city) {
    return city
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ł/g, "l")
        .replace(/[^a-z]/g, "");
}

async function getWeather(city) {

    const key = normalizeCity(city);
    const location = CITIES[key];

    if (!location) {
        throw new Error(
            `Nie znam miasta "${city}".`
        );
    }

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        "&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m" +
        "&timezone=Europe%2FWarsaw" +
        "&temperature_unit=celsius" +
        "&wind_speed_unit=kmh";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Serwer pogodowy HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (!data.current) {
        throw new Error(
            "Brak aktualnych danych pogodowych."
        );
    }

    const current = data.current;

    return {
        city: location.name,
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        precipitation: current.precipitation,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        description: weatherDescription(
            current.weather_code
        ),
        time: current.time
    };
}

// ========================================
// 🤖 GROQ AI
// ========================================

async function askGroq(apiKey, messages) {

    const cleanMessages = messages
        .filter(message =>
            message &&
            (message.role === "user" ||
             message.role === "assistant") &&
            typeof message.content === "string"
        )
        .slice(-20);

    const systemMessage = {
        role: "system",
        content: `
Jesteś NEXUS AI — asystentem systemu NEXUS OS.

Odpowiadaj po polsku, chyba że użytkownik poprosi o inny język.

Pomagaj w:
- matematyce,
- programowaniu,
- Minecraft,
- komputerach,
- nauce,
- NEXUS OS,
- zwykłej rozmowie.

Jeżeli pytanie dotyczy pogody,
NEXUS OS posiada osobny moduł pogodowy.

Odpowiadaj konkretnie, jasno i przyjaźnie.
`
    };

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },

            body: JSON.stringify({
                model: "groq/compound",

                messages: [
                    systemMessage,
                    ...cleanMessages
                ]
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error?.message ||
            `Groq HTTP ${response.status}`
        );
    }

    const message =
        data?.choices?.[0]?.message;

    if (!message || !message.content) {
        throw new Error(
            "Groq nie zwróciło odpowiedzi."
        );
    }

    return message.content;
}

// ========================================
// 🌐 HTTP SERVER
// ========================================

const server = http.createServer(async (req, res) => {

    // ====================================
    // 🖥️ NEXUS OS
    // ====================================

    if (
        req.method === "GET" &&
        (req.url === "/" ||
         req.url === "/index.html")
    ) {

        try {

            const html =
                fs.readFileSync(INDEX);

            res.writeHead(200, {
                "Content-Type":
                    "text/html; charset=utf-8",
                "Cache-Control": "no-store"
            });

            res.end(html);

        } catch (error) {

            sendJson(res, 500, {
                error:
                    "Nie można otworzyć index.html."
            });
        }

        return;
    }

    // ====================================
    // 🌦️ WEATHER
    // ====================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/api/weather")
    ) {

        try {

            const url = new URL(
                req.url,
                `http://${HOST}:${PORT}`
            );

            const city =
                url.searchParams.get("city") ||
                "Wrocław";

            console.log("");
            console.log(
                "🌦️ POBIERAM POGODĘ:",
                city
            );

            const weather =
                await getWeather(city);

            console.log(
                `🌡️ ${weather.temperature}°C`
            );

            console.log(
                `☁️ ${weather.description}`
            );

            return sendJson(
                res,
                200,
                weather
            );

        } catch (error) {

            console.error(
                "❌ Błąd pogody:",
                error.message
            );

            return sendJson(
                res,
                500,
                {
                    error: error.message
                }
            );
        }
    }

    // ====================================
    // 🧠 NEXUS AI
    // ====================================

    if (
        req.method === "POST" &&
        req.url === "/api/ai/chat"
    ) {

        try {

            const rawBody =
                await readBody(req);

            const body =
                JSON.parse(rawBody);

            const apiKey =
                String(
                    body.apiKey || ""
                ).trim();

            const messages =
                Array.isArray(body.messages)
                    ? body.messages
                    : [];

            if (!apiKey) {

                return sendJson(
                    res,
                    400,
                    {
                        error:
                            "Brak Groq API Key."
                    }
                );
            }

            if (!messages.length) {

                return sendJson(
                    res,
                    400,
                    {
                        error:
                            "Brak wiadomości."
                    }
                );
            }

            console.log("");
            console.log(
                "🧠 NEXUS AI"
            );

            console.log(
                "💬",
                messages[
                    messages.length - 1
                ]?.content
            );

            const reply =
                await askGroq(
                    apiKey,
                    messages
                );

            console.log(
                "✅ Odpowiedź AI"
            );

            return sendJson(
                res,
                200,
                {
                    reply
                }
            );

        } catch (error) {

            console.error("");
            console.error(
                "❌ BŁĄD NEXUS AI:"
            );

            console.error(
                error.message
            );

            console.error("");

            return sendJson(
                res,
                500,
                {
                    error:
                        error.message
                }
            );
        }
    }

    // ====================================
    // FAVICON
    // ====================================

    if (req.url === "/favicon.ico") {

        res.writeHead(204);
        res.end();

        return;
    }

    // ====================================
    // 404
    // ====================================

    res.writeHead(404, {
        "Content-Type":
            "text/plain; charset=utf-8"
    });

    res.end(
        "404 - NEXUS OS"
    );
});

// ========================================
// 🚀 START
// ========================================

server.listen(
    PORT,
    HOST,
    () => {

        console.log("");
        console.log(
            "🚀 NEXUS OS działa!"
        );

        console.log(
            `🌐 http://${HOST}:${PORT}`
        );

        console.log(
            "🧠 Groq AI: /api/ai/chat"
        );

        console.log(
            "🌦️ Pogoda: /api/weather"
        );

        console.log(
            "☁️ Open-Meteo: AKTYWNE"
        );

        console.log("");
    }
);