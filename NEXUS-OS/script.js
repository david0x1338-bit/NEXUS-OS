```js
// =====================================================
// NEXUS OS
// =====================================================


// =========================
// ELEMENTY
// =========================

const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");


// =========================
// PAINT
// =========================

const paint = document.getElementById("paint");
const paintIcon = document.getElementById("paintIcon");
const startPaint = document.getElementById("startPaint");
const closePaint = document.getElementById("closePaint");


// =========================
// NOTATNIK
// =========================

const notepad = document.getElementById("notepad");
const notepadIcon = document.getElementById("notepadIcon");
const startNotepad = document.getElementById("startNotepad");
const notepadClose = document.getElementById("notepadClose");

const notepadText = document.getElementById("notepadText");
const fontSize = document.getElementById("fontSize");
const fileInput = document.getElementById("fileInput");


// =========================
// ZEGAR
// =========================

const clockIcon = document.getElementById("clockIcon");
const startClock = document.getElementById("startClock");
const clockWindow = document.getElementById("clockWindow");
const closeClock = document.getElementById("closeClock");


// =========================
// CMD
// =========================

const cmd = document.getElementById("cmd");
const cmdInput = document.getElementById("cmdInput");
const cmdOutput = document.getElementById("cmdOutput");
const closeCmd = document.getElementById("closeCmd");

const cmdIcon = document.getElementById("cmdIcon");
const startCmd = document.getElementById("startCmd");


// =====================================================
// MENU START
// =====================================================

if (startButton && startMenu) {

    startButton.addEventListener("click", function () {

        if (startMenu.style.display === "block") {
            startMenu.style.display = "none";
        } else {
            startMenu.style.display = "block";
        }

    });

}


// =====================================================
// ZEGAR
// =====================================================

function updateClock() {

    const now = new Date();

    const h =
        String(now.getHours()).padStart(2, "0");

    const m =
        String(now.getMinutes()).padStart(2, "0");

    const s =
        String(now.getSeconds()).padStart(2, "0");


    const taskbarClock =
        document.getElementById("taskbarClock");

    if (taskbarClock) {
        taskbarClock.textContent =
            h + ":" + m + ":" + s;
    }


    const bigClock =
        document.getElementById("bigClock");

    if (bigClock) {
        bigClock.textContent =
            h + ":" + m + ":" + s;
    }


    const day =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year =
        now.getFullYear();


    const clockDate =
        document.getElementById("clockDate");

    if (clockDate) {
        clockDate.textContent =
            day + "." + month + "." + year;
    }

}


updateClock();

setInterval(updateClock, 1000);


// =====================================================
// ZAMYKANIE APLIKACJI
// =====================================================

function closeAllApps() {

    const apps = [
        "paint",
        "notepad",
        "clockWindow",
        "cmd"
    ];

    apps.forEach(function (id) {

        const app =
            document.getElementById(id);

        if (app) {
            app.style.display = "none";
        }

    });

}


// =====================================================
// PAINT
// =====================================================

function openPaint() {

    closeAllApps();

    if (startMenu) {
        startMenu.style.display = "none";
    }

    if (paint) {

        paint.style.display = "flex";

        resizeCanvas();

    }

}


if (paintIcon) {
    paintIcon.addEventListener("click", openPaint);
}

if (startPaint) {
    startPaint.addEventListener("click", openPaint);
}

if (closePaint) {

    closePaint.addEventListener(
        "click",
        function () {

            if (paint) {
                paint.style.display = "none";
            }

        }
    );

}


// =====================================================
// PAINT CANVAS
// =====================================================

const canvas =
    document.getElementById("paintCanvas");

const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;

const colorPicker =
    document.getElementById("colorPicker");

const brushSize =
    document.getElementById("brushSize");

const brushSizeValue =
    document.getElementById("brushSizeValue");

let drawing = false;


function resizeCanvas() {

    if (!canvas || !ctx) {
        return;
    }

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight - 110;

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


resizeCanvas();


if (brushSize) {

    brushSize.addEventListener(
        "input",
        function () {

            if (brushSizeValue) {

                brushSizeValue.textContent =
                    brushSize.value + " px";

            }

        }
    );

}


if (canvas && ctx) {

    canvas.addEventListener(
        "mousedown",
        function (event) {

            drawing = true;

            ctx.beginPath();

            ctx.moveTo(
                event.offsetX,
                event.offsetY
            );

        }
    );


    canvas.addEventListener(
        "mousemove",
        function (event) {

            if (!drawing) {
                return;
            }

            ctx.lineWidth =
                Number(
                    brushSize
                        ? brushSize.value
                        : 5
                );

            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.strokeStyle =
                colorPicker
                    ? colorPicker.value
                    : "#000000";

            ctx.lineTo(
                event.offsetX,
                event.offsetY
            );

            ctx.stroke();

        }
    );


    canvas.addEventListener(
        "mouseup",
        function () {

            drawing = false;

            ctx.closePath();

        }
    );


    canvas.addEventListener(
        "mouseleave",
        function () {

            drawing = false;

        }
    );

}


const clearPaint =
    document.getElementById("clearPaint");

if (clearPaint) {

    clearPaint.addEventListener(
        "click",
        function () {

            if (!canvas || !ctx) {
                return;
            }

            ctx.fillStyle = "#ffffff";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }
    );

}


// =====================================================
// NOTATNIK
// =====================================================

function openNotepad() {

    closeAllApps();

    if (startMenu) {
        startMenu.style.display = "none";
    }

    if (notepad) {
        notepad.style.display = "flex";
    }

    if (notepadText) {
        notepadText.focus();
    }

}


if (notepadIcon) {
    notepadIcon.addEventListener("click", openNotepad);
}

if (startNotepad) {
    startNotepad.addEventListener("click", openNotepad);
}

if (notepadClose) {

    notepadClose.addEventListener(
        "click",
        function () {

            if (notepad) {
                notepad.style.display = "none";
            }

        }
    );

}


if (fontSize) {

    fontSize.addEventListener(
        "input",
        function () {

            if (notepadText) {

                notepadText.style.fontSize =
                    fontSize.value + "px";

            }

        }
    );

}


// =====================================================
// NOWY PLIK
// =====================================================

const newFile =
    document.getElementById("newFile");

if (newFile) {

    newFile.addEventListener(
        "click",
        function () {

            if (
                notepadText &&
                notepadText.value.trim() !== ""
            ) {

                if (!confirm("Usunąć aktualny tekst?")) {
                    return;
                }

            }

            if (notepadText) {

                notepadText.value = "";

                notepadText.focus();

            }

        }
    );

}


// =====================================================
// OTWÓRZ PLIK
// =====================================================

const openFile =
    document.getElementById("openFile");

if (openFile) {

    openFile.addEventListener(
        "click",
        function () {

            if (fileInput) {
                fileInput.click();
            }

        }
    );

}


if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                function (event) {

                    if (notepadText) {

                        notepadText.value =
                            event.target.result;

                    }

                };

            reader.readAsText(file);

            fileInput.value = "";

        }
    );

}


// =====================================================
// ZAPISZ PLIK
// =====================================================

const saveFile =
    document.getElementById("saveFile");

if (saveFile) {

    saveFile.addEventListener(
        "click",
        function () {

            if (!notepadText) {
                return;
            }

            const blob =
                new Blob(
                    [notepadText.value],
                    {
                        type:
                            "text/plain;charset=utf-8"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download = "notatka.txt";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        }
    );

}


// =====================================================
// ZEGAR — OTWIERANIE
// =====================================================

function openClock() {

    closeAllApps();

    if (startMenu) {
        startMenu.style.display = "none";
    }

    if (clockWindow) {
        clockWindow.style.display = "flex";
    }

    updateClock();

}


if (clockIcon) {
    clockIcon.addEventListener("click", openClock);
}

if (startClock) {
    startClock.addEventListener("click", openClock);
}

if (closeClock) {

    closeClock.addEventListener(
        "click",
        function () {

            if (clockWindow) {
                clockWindow.style.display = "none";
            }

        }
    );

}


// =====================================================
// CMD — OTWIERANIE
// =====================================================

function openCmd() {

    closeAllApps();

    if (startMenu) {
        startMenu.style.display = "none";
    }

    if (!cmd) {
        console.error("Nie znaleziono #cmd");
        return;
    }

    cmd.style.display = "flex";

    if (cmdInput) {

        cmdInput.disabled = false;
        cmdInput.readOnly = false;
        cmdInput.tabIndex = 0;

        setTimeout(function () {
            cmdInput.focus();
        }, 100);

    }

}


if (cmdIcon) {
    cmdIcon.addEventListener("click", openCmd);
}

if (startCmd) {
    startCmd.addEventListener("click", openCmd);
}


// =====================================================
// CMD — ZAMYKANIE
// =====================================================

if (closeCmd) {

    closeCmd.addEventListener(
        "click",
        function () {

            if (cmd) {
                cmd.style.display = "none";
            }

        }
    );

}


// =====================================================
// CMD — POMOCNICZE
// =====================================================

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function scrollCmdToBottom() {

    if (cmdOutput) {

        cmdOutput.scrollTop =
            cmdOutput.scrollHeight;

    }

}


// =====================================================
// CMD — KOMENDY
// =====================================================

function runCommand(command) {

    if (!cmdOutput) {
        return;
    }


    // Usuwamy spacje z początku i końca
    const originalCommand =
        String(command).trim();


    // Małe litery + usunięcie nadmiarowych spacji
    const commandLower =
        originalCommand
            .toLowerCase()
            .replace(/\s+/g, " ");


    // =================================================
    // STOP — SPRAWDZAMY JAKO PIERWSZE
    // =================================================

    if (commandLower === "stop") {

        cmdOutput.innerHTML +=
            "<br>" +

            "<span style='color:#00ff66;font-weight:bold;font-size:20px'>" +
            "NEXUS OS" +
            "</span><br><br>" +

            "<span style='color:#ffffff'>" +
            "⚠ NEXUS OS jest obecnie prototypem.<br>" +
            "System jest nadal rozwijany.<br><br>" +

            "🚀 W przyszłości NEXUS OS ma stać się " +
            "prawdziwym systemem operacyjnym.<br><br>" +

            "🛠️ Planowany rozwój obejmuje:<br>" +
            "• prawdziwy kernel<br>" +
            "• pulpit systemowy<br>" +
            "• system plików<br>" +
            "• terminal<br>" +
            "• aplikacje<br>" +
            "• ustawienia systemowe<br><br>" +

            "STATUS: " +

            "<span style='color:#00ff66;font-weight:bold'>" +
            "DEVELOPMENT" +
            "</span>" +

            "</span><br><br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // POKAZUJEMY WPISANĄ KOMENDĘ
    // =================================================

    if (originalCommand !== "") {

        cmdOutput.innerHTML +=
            "<br>" +
            "<span style='color:#888'>" +
            "C:\\NEXUS&gt; " +
            escapeHtml(originalCommand) +
            "</span><br>";

    }


    // =================================================
    // PUSTA
    // =================================================

    if (commandLower === "") {

        return;

    }


    // =================================================
    // HELP
    // =================================================

    if (commandLower === "help") {

        cmdOutput.innerHTML +=
            "<span style='color:#00ff66;font-weight:bold'>" +
            "Dostępne komendy:" +
            "</span><br><br>" +

            "<span style='color:#66ccff'>help</span> — pomoc<br>" +
            "<span style='color:#66ccff'>stop</span> — informacje o NEXUS OS<br>" +
            "<span style='color:#66ccff'>clear</span> — wyczyść ekran<br>" +
            "<span style='color:#66ccff'>cls</span> — wyczyść ekran<br>" +
            "<span style='color:#66ccff'>echo tekst</span> — wyświetl tekst<br>" +
            "<span style='color:#66ccff'>date</span> — pokaż datę<br>" +
            "<span style='color:#66ccff'>time</span> — pokaż godzinę<br>" +
            "<span style='color:#66ccff'>ver</span> — wersja systemu<br>" +
            "<span style='color:#66ccff'>whoami</span> — użytkownik<br>" +
            "<span style='color:#66ccff'>about</span> — informacje o systemie<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // CLEAR / CLS
    // =================================================

    if (
        commandLower === "clear" ||
        commandLower === "cls"
    ) {

        cmdOutput.innerHTML = "";

        return;
    }


    // =================================================
    // ECHO
    // =================================================

    if (
        commandLower === "echo" ||
        commandLower.startsWith("echo ")
    ) {

        const text =
            originalCommand
                .substring(4)
                .trim();

        cmdOutput.innerHTML +=
            escapeHtml(text) +
            "<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // DATE
    // =================================================

    if (commandLower === "date") {

        cmdOutput.innerHTML +=
            "Data: " +
            new Date().toLocaleDateString("pl-PL") +
            "<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // TIME
    // =================================================

    if (commandLower === "time") {

        cmdOutput.innerHTML +=
            "Czas: " +
            new Date().toLocaleTimeString("pl-PL") +
            "<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // VER
    // =================================================

    if (commandLower === "ver") {

        cmdOutput.innerHTML +=
            "NEXUS OS [Version 1.0]<br>" +
            "Build: Prototype<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // WHOAMI
    // =================================================

    if (commandLower === "whoami") {

        cmdOutput.innerHTML +=
            "NEXUS\\User<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // ABOUT
    // =================================================

    if (commandLower === "about") {

        cmdOutput.innerHTML +=
            "<span style='color:#00ff66;font-weight:bold'>" +
            "NEXUS OS" +
            "</span><br>" +

            "Wersja: 1.0<br>" +
            "Status: Prototype<br>" +
            "Tryb: Web OS<br>" +
            "Projekt w trakcie rozwoju.<br>";

        scrollCmdToBottom();

        return;
    }


    // =================================================
    // NIEZNANA KOMENDA
    // =================================================

    cmdOutput.innerHTML +=
        "<span style='color:#ff5555'>" +
        "Błąd:" +
        "</span> '" +

        escapeHtml(originalCommand) +

        "' nie jest rozpoznawaną komendą NEXUS OS.<br>" +

        "Wpisz " +

        "<span style='color:#66ccff'>help</span>" +

        ", aby zobaczyć dostępne komendy.<br>";

    scrollCmdToBottom();

}


// =====================================================
// ENTER W CMD
// =====================================================

if (cmdInput) {

    cmdInput.disabled = false;
    cmdInput.readOnly = false;
    cmdInput.tabIndex = 0;

    cmdInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                const command =
                    cmdInput.value;

                cmdInput.value = "";

                runCommand(command);

                setTimeout(function () {
                    cmdInput.focus();
                }, 0);

            }

        }
    );

}


// =====================================================
// KLIKNIĘCIE W CMD
// =====================================================

if (cmd) {

    cmd.addEventListener(
        "click",
        function () {

            if (cmdInput) {

                setTimeout(function () {
                    cmdInput.focus();
                }, 0);

            }

        }
    );

}


// =====================================================
// POGODA
// =====================================================

async function getNexusWeather(
    city = "wroclaw"
) {

    try {

        const response =
            await fetch(
                "/api/weather?city=" +
                encodeURIComponent(city)
            );

        if (!response.ok) {
            throw new Error(
                "HTTP " + response.status
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "❌ Błąd pogody:",
            error
        );

        return null;
    }

}


async function showNexusWeather() {

    const weather =
        await getNexusWeather("wroclaw");


    if (!weather) {

        alert(
            "❌ Nie udało się pobrać pogody."
        );

        return;
    }


    alert(
        "🌦️ POGODA — " +
        weather.city +

        "\n\n🌡️ Temperatura: " +
        weather.temperature +
        "°C\n" +

        "🌡️ Odczuwalna: " +
        weather.apparentTemperature +
        "°C\n" +

        "💨 Wiatr: " +
        weather.windSpeed +
        " km/h\n" +

        "🌧️ Opady: " +
        weather.precipitation +
        " mm\n\n" +

        "☁️ " +
        weather.description
    );

}


// =====================================================
// START
// =====================================================

console.log(
    "🟢 NEXUS OS script.js załadowany — CMD STOP READY"
);


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    function () {

        if (
            paint &&
            paint.style.display === "flex"
        ) {

            resizeCanvas();

        }

    }
);
```
