function updateClock() {
    const clock = document.getElementById("clock");
    if (clock) clock.textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);

document.getElementById("terminal").addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Binary Background Animation
const binaryCanvas = document.getElementById("binaryCanvas");
const ctx = binaryCanvas.getContext("2d");
let matrixColor = "#00ff00";
let drops = [];

function resizeCanvas() {
    binaryCanvas.width = window.innerWidth;
    binaryCanvas.height = window.innerHeight;
    drops = Array(Math.floor(binaryCanvas.width / 20)).fill(1);
}

function drawBinaryBackground() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);
    ctx.fillStyle = matrixColor;
    ctx.font = "14px JetBrains Mono";

    drops.forEach((drop, i) => {
        const char = Math.random() > 0.5 ? "0" : "1";
        ctx.fillText(char, i * 20, drop * 20);
        if (drop * 20 > binaryCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

// Date Display
const date = document.getElementById("date");
function getFormattedDate(date) {
    const day = date.toLocaleDateString("en-GB", { dateStyle: "full" });
    return `${day}`;
}

function updateDate() {
    const now = new Date();
    const formattedDate = getFormattedDate(now);
    date.textContent = formattedDate.toLocaleLowerCase();
}
updateDate();

// Themes management
const themes = {
    default: {
        bg: "bg-gray-900",
        text: "text-[#00ff00]",
        code: "#00ff00",
        border: "border-[#00ff00]/30",
        key: "#ffff00",
        string: "#33eee2",
    },
    monokai: {
        bg: "bg-[#272822]",
        text: "text-[#f8f8f2]",
        code: "#f8f8f2",
        border: "border-[#f8f8f2]/30",
        key: "#AE81FF",
        string: "#A6E22E",
    },
    night: {
        bg: "bg-[#25282b]",
        text: "text-[#76b5c6]",
        code: "#76b5c6",
        border: "border-[#76b5c6]/30",
        key: "#c678dd",
        string: "#d19a66",
    },

    dracula: {
        bg: "bg-[#282a36]",
        text: "text-[#f8f8f2]",
        code: "#f8f8f2",
        border: "border-[#f8f8f2]/30",
        key: "#ff79c6",
        string: "#50FA7B",
    },
    matrix: {
        bg: "bg-gray-900",
        text: "text-[#00ff00]",
        code: "#00ff00",
        border: "border-[#00ff00]/30",
        key: "#00ff00",
        string: "#00ff00",
    },

    solarized: {
        bg: "bg-[#002b36]",
        text: "text-[#aac0c7]",
        code: "#aac0c7",
        border: "border-[#aac0c7]/30",
        key: "#b58900",
        string: "#D33682 ",
    },
    light: {
        bg: "bg-[#efefef]",
        text: "text-[#2c2d2b]",
        code: "#000000",
        border: "border-black/30",
        key: "#3594e2",
        string: "#D33682 ",
    },
};

let currentTheme = "default";
function changeTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
        currentTheme = themeName;
        document.body.className = `${theme.bg} ${theme.text} terminal-font`;
        document.getElementById(
            "terminal"
        ).className = `backdrop-blur-sm rounded-lg shadow-2xl ${theme.border} ${theme.text} ${theme.bg}`;
        document.querySelector(
            ".terminal-header"
        ).className = `terminal-header sticky top-0  p-4 border-b ${theme.border} flex justify-between items-center`;
        document.querySelector(
            ".prompt"
        ).className = `prompt flex items-center space-x-2 border-t ${theme.border} p-4`;
        matrixColor = theme.code;

        // Update key color
        const keys = document.querySelectorAll(".key");
        keys.forEach((key) => {
            key.style.color = theme.key;
        });

        // Update string color
        const strings = document.querySelectorAll(".string");
        strings.forEach((string) => {
            string.style.color = theme.string;
        });
        // Update placeholder color
        const input = document.getElementById("input");
        input.classList.remove(
            "default-placeholder",
            "monokai-placeholder",
            "night-placeholder",
            "dracula-placeholder",
            "solarized-placeholder",
            "light-placeholder"
        );
        input.classList.add(`${themeName}-placeholder`);
    }
}

// Contact Form  Management
let contactState = {
    active: false,
    currentStep: 0,
    data: { name: "", email: "", message: "" },
    steps: ["name", "email", "message", "submit"],
};

function resetContactState() {
    contactState = {
        active: false,
        currentStep: 0,
        data: { name: "", email: "", message: "" },
        steps: ["name", "email", "message", "submit"],
    };
}

function validateField(field, value) {
    if (field === "name" && value.trim().length < 3)
        return "name must be at least 3 characters";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "invalid email address";
    if (field === "message" && value.trim().length < 10)
        return "message must be at least 10 characters";
    return null;
}

function displayContactForm() {
    const input = document.getElementById("input");
    const prompt = document.querySelector(".prompt span:nth-child(2)");
    const currentStep = contactState.steps[contactState.currentStep];
    prompt.classList.remove("string");
    if (currentStep === "submit") {
        prompt.innerHTML =
            "type '<span class='string'>submit</span>' to send the message: ";
        input.placeholder = "type 'submit' to confirm";
        return;
    }

    prompt.textContent = `enter your ${currentStep}:`;
    input.placeholder = `type your ${currentStep} here`;
}

function handleContactInput(value) {
    const currentStep = contactState.steps[contactState.currentStep];
    const error = validateField(currentStep, value);

    if (value === "exit" || value === "close") {
        addOutput("contact form closed successfully", "info");
        resetContactState();
        displayDefaultPrompt();
        return;
    }

    if (error) {
        addOutput(`${error}`, "error");
        return;
    }

    contactState.data[currentStep] = value.trim();
    contactState.currentStep++;

    if (contactState.currentStep >= contactState.steps.length) {
        addOutput(
            "all fields filled! type 'submit to send the message.",
            "success"
        );
        displayContactForm();
    } else {
        displayContactForm();
    }
}

function handleBackward() {
    if (contactState.currentStep > 0) {
        contactState.currentStep--;
        displayContactForm();
    }
}

function handleForward() {
    if (contactState.currentStep < contactState.steps.length - 1) {
        const currentStep = contactState.steps[contactState.currentStep];
        if (!contactState.data[currentStep]) {
            addOutput("please fill the current field first", "error");
            return;
        }
        contactState.currentStep++;
        displayContactForm();
    }
}

function submitContactForm() {
    addOutput(
        `<i class="ri-check-line"></i> message submitted successfully!`,
        "success"
    );
    addOutput("thank you for reaching out!", "info");
    resetContactState();
    displayDefaultPrompt();
}

function displayDefaultPrompt() {
    const input = document.getElementById("input");
    const prompt = document.querySelector(".prompt span:nth-child(2)");
    prompt.innerHTML = `
    <div class="flex items-center gap-1">
        <span class="string">terminal@guest</span>
    </div>
    `
    input.placeholder = "type 'help' or 'ls' for commands";
}

// Game  Management
let gameState = {
    active: false,
    setup: true,
    target: null,
    attempts: 0,
    max_attempts: 7,
    min: 1,
    max: 100,
};

function startGame() {
    gameState.active = true;
    gameState.setup = true;
    gameState.phase = "max_attempts";
    addOutput("starting number guessing game - customize your game:", "info");
    addOutput("type '<span class='string'>exit</span>' or '<span class='string'>quit</span>' to exit the game", "info");
    addOutput(`press <kbd class="string">ctrl</kbd> + <kbd class="string">x</kbd> to exit the game.</div>`, "info");
    updateGamePrompt("type max attempts (default 7)", "enter max attempts: ");
    return "";
}

// function to prevent pointer events in input field
function preventPointerEvents() {
    const input = document.getElementById("input");
    input.style.pointerEvents = "none";
    input.addEventListener("focus", (e) => {
        e.target.preventDefault();
    });
}

// function to allow pointer events in input field
function allowPointerEvents() {
    const input = document.getElementById("input");
    input.style.pointerEvents = "auto";
}

function handleGameSetup(input) {
    const value = parseInt(input);

    switch (gameState.phase) {
        case "max_attempts":
            if (!isNaN(value) && value > 0) {
                gameState.max_attempts = value;
                gameState.phase = "min_number";
                updateGamePrompt("type min number (default 1):", "enter min number: ");
            } else {
                addOutput("invalid input. using default 7 attempts", "error");
                gameState.phase = "min_number";
                updateGamePrompt("type min number (default 1):", "enter min number: ");
            }
            break;

        case "min_number":
            if (!isNaN(value)) {
                gameState.min = value;
                gameState.phase = "max_number";
                updateGamePrompt("type max number (default 100)", "enter max number: ");
            } else {
                addOutput("invalid input. using default min 1", "error");
                gameState.phase = "max_number";
                updateGamePrompt("type max number (default 100)", "enter max number: ");
            }
            break;

        case "max_number":
            if (!isNaN(value) && value > gameState.min) {
                gameState.max = value;
                finishGameSetup();
            } else {
                addOutput(
                    `invalid input. using default max ${gameState.min + 99}`,
                    "error"
                );
                gameState.max = gameState.min + 99;
                finishGameSetup();
            }
            break;
    }
}

function finishGameSetup() {
    gameState.target =
        Math.floor(Math.random() * (gameState.max - gameState.min + 1)) +
        gameState.min;
    gameState.attempts = 0;
    gameState.setup = false;

    addOutput(
        `game started! guess a number between <span class='key'>${gameState.min}</span> and <span class='key'>${gameState.max}</span>`,
        "info"
    );
    addOutput(
        `you have <span class='key'>${gameState.max_attempts}</span> attempts to guess the number`,
        "info"
    );
    updateGamePrompt("type your guess", `enter your guess: `);
}

function handleGamePlay(input) {
    if (input === "exit" || input === "quit") {
        addOutput(
            `game exited. the number was <span class='key'>${gameState.target}</span>`,
            "info"
        );
        resetGameState();
        return;
    }

    const guess = parseInt(input);
    if (isNaN(guess)) {
        addOutput("invalid input. please enter a number", "error");
        return;
    }

    gameState.attempts++;

    if (guess === gameState.target) {
        addOutput(
            `congratulations! you guessed the number in <span class='key'>${gameState.attempts
            }</span> <span class='key'></span>${gameState.attempts === 1 ? "attempt" : "attempts"
            }`,
            "success"
        );
        resetGameState();
        return;
    }

    if (gameState.attempts >= gameState.max_attempts) {
        addOutput(
            `game over. the number was <span class='key'>${gameState.target}</span>`,
            "info"
        );
        resetGameState();
        return;
    }

    const remaining = gameState.max_attempts - gameState.attempts;
    const hint = guess < gameState.target ? "low" : "high";
    addOutput(
        `too <span class='key'>${hint}!</span> - you have <span class='string'>${remaining}</span> ${remaining === 1 ? "attempt" : "attempts"
        } left`,
        "game"
    );
    updateGamePrompt("guess a number:", "guess a number: ");
}

function updateGamePrompt(placeholder, promptText) {
    const input = document.getElementById("input");
    input.placeholder = placeholder;
    const prompt = document.querySelector(".terminal-guest");
    prompt.innerHTML = promptText;
    input.focus();
}

function resetGameState() {
    gameState = {
        active: false,
        setup: true,
        target: null,
        attempts: 0,
        max_attempts: 7,
        min: 1,
        max: 100,
    };
    displayDefaultPrompt();
}

// display all commands
function showAllCommands() {
    return `
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-1.5">
    <span class="opacity-90 key" aria-label="show initial commands">▸ ls or help</span><span>displays initial commands</span>
    <span class="opacity-90 key" aria-label="show all commands">▸ ls -a or help -a</span><span>displays all commands</span>
    <span class="opacity-90 key" aria-label="about me">▸ about</span><span>learn more about me</span>
    <span class="opacity-90 key" aria-label="technical proficiencies">▸ skill</span><span>view my technical skills</span>
    <span class="opacity-90 key" aria-label="view my projects">▸ project</span><span>explore my projects</span>
    <span class="opacity-90 key" aria-label="available themes">▸ theme</span><span>see available themes</span>
    <span class="opacity-90 key" aria-label="contact information">▸ contact</span><span>get in touch</span>
    <span class="opacity-90 key" aria-label="clear terminal">▸ clear</span><span>clear the terminal</span>
    <span class="opacity-90 key" aria-label="play number guessing game">▸ game</span><span>play a number guessing game</span>
    <span class="opacity-90 key" aria-label="show current time">▸ time</span><span>display the current time</span>
    <span class="opacity-90 key" aria-label="show current date">▸ date</span><span>display the current date</span>
    <span class="opacity-90 key" aria-label="show command history">▸ his</span><span>view command history</span>
    <span class="opacity-90 key" aria-label="clear command history">▸ rm his</span><span>clear command history</span>
    <span class="key" aria-label="checkout gui portfolio">▸ gui</span><span>explore my gui portfolio</span>
    <span class="key" aria-label="tell a joke">▸ joke</span><span>tell a random joke</span>
    <span class="key" aria-label="display a quote">▸ quote</span><span>display a random quote</span>
    <span class="key" aria-label="display weather forecast">▸ weather</span><span>display weather forecast</span>
    <span class="key" aria-label="open my resume">▸ open cv</span><span>explore my resume</span>
    <span class="key" aria-label="download cv">▸ download cv</span><span>download my resume</span>
    <span class="key" aria-label="display my location">▸ my loc</span><span>display my location</span>
    <span class="key" aria-label="display my location details">▸ my loc -a</span><span>display my location details</span>
    <span class="key" aria-label="download cv">▸ my ip</span><span>display my ip address</span>
    <span class="key" aria-label="open my github">▸ github</span><span>explore my github profile</span>

</div>
 <div class="my-4">
    <p>press <kbd class="string">ctrl</kbd> + <kbd class="string">q</kbd> to clear the terminal</p>
    <p> press <span class="string">up arrow</span> key to navigate through previous command. </p>
    <p>press <span class="string">down arrow</span> key to navigate through next command. </p>
</div>

    `;
}

// display commands
function showCommands() {
    return `
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-1.5">
    <span class="opacity-90 key" aria-label="show initial commands">▸ ls or help</span><span>displays initial commands</span>
    <span class="opacity-90 key" aria-label="show all commands">▸ ls -a or help -a</span><span>displays all commands</span>
    <span class="opacity-90 key" aria-label="about me">▸ about</span><span>learn more about me</span>
    <span class="opacity-90 key" aria-label="technical proficiencies">▸ skill</span><span>view my technical skills</span>
    <span class="opacity-90 key" aria-label="view my projects">▸ project</span><span>explore my projects</span>
    <span class="opacity-90 key" aria-label="available themes">▸ theme</span><span>see available themes</span>
    <span class="opacity-90 key" aria-label="contact information">▸ contact</span><span>get in touch</span>
    <span class="opacity-90 key" aria-label="clear terminal">▸ clear</span><span>clear the terminal</span>
    <span class="opacity-90 key" aria-label="play number guessing game">▸ game</span><span>play a number guessing game</span>
</div>
 <div class="my-4">
    <p>press <kbd class="string">ctrl</kbd> + <kbd class="string">q</kbd> to clear the terminal</p>
    <p> press <span class="string">up arrow</span> key to navigate through previous command. </p>
    <p>press <span class="string">down arrow</span> key to navigate through next command. </p>
</div>

    `;
}

// display about me
function displayAbout() {
    return `<div class="mb-4">
    <h2 class="text-[16.5px] sm:text-xl font-bold">about me: </h2>
    <div class="my-4">
        <p>
            Hello! I'm <span class="string">Akkal Dhami</span>, a passionate and dedicated  <strong class="key">Frontend Developer</strong> with a strong foundation in <strong class="key">HTML</strong>, <strong class="key">CSS</strong> and <strong class="key">JavaScript</strong>. I have a deep understanding of user interfaces and user experience, and I enjoy creating visually appealing and functional websites. I'm a quick learner and always seeking new challenges to enhance my skills.
        </p>
    </div>
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-2">
        <span class="key">▸ name</span><span>akkal dhami</span>
        <span class="key">▸ email</span><span>akkaldhami21@gmail.com</span>
        <span class="key">▸ contact</span><span>+977-9828122071</span>
        <span class="key">▸ github</span><span><a target="_blank" href="https://github.com/AkkalDhami">https://github.com/AkkalDhami</a></span>
    </div>
</div>`;
}

// display skills
function displaySkills() {
    return `
    <div class="mb-4">
        <h2 class="text-[16.5px] sm:text-xl font-bold">skills & technologies: </h2>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-2">
            <span class="key">▸ frontend</span><span class="flex gap-x-2"><p class="glow">#html5</p><p class="glow">#css3</p> <p class="glow">#javascript</p> <p class="glow">#tailwindcss</p></span>
            <span class="key">▸ backend</span><span class="flex gap-x-2"><p class="glow">#nodejs</p> <p class="glow">#express</p></span>
            <span class="key">▸ databases</span><span class="flex gap-x-2"><p class="glow">#mysql</p> <p class="glow">#mongodb</p></span>
            <span class="key">▸ version control</span><span class="flex gap-x-2"><p class="glow">#git</p> <p class="glow">#github</p></span>
            <span class="key">▸ code editor</span><span class="flex gap-x-2"><p class="glow">#vscode</p> <p class="glow">#winsurf</p> <p class="glow">#cursor</p></span>
            <span class="key">▸ operating system</span><span class="flex gap-x-2"><p class="glow">#windows</p></span>
            <span class="key">▸ api testing</span><span class="flex gap-x-2"><p class="glow">#postman</p></span>
        </div>
    </div>
    `;
}

// display projects
function displayProjects() {
    return `
       <div class="mb-4">
                <h2 class="text-[16.5px] sm:text-xl font-bold">view my projects: </h2>
                   <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-2">
                    <span class="key">▸ <a target="_blank" href="https://nepkart.vercel.app">nepkart</a></span><span class="flex gap-x-2">e commerce website</span>
                    <span class="key">▸ <a target="_blank" href="https://dishhdashh.vercel.app">dishhdashh</a></span><span class="flex gap-x-2">food delivery website</span>
                    <span class="key">▸ <a target="_blank" href="https://portfolio-akkal.vercel.app/">portfolio</a></span><span class="flex gap-x-2">personal portfolio</span>
                </div>
            </div>     
            `;
}

// display time
function displayTime() {
    return `
    <div class="mb-4">
             <p><span class="key">current time: </span>${new Date().toLocaleTimeString()}</p>
        </div>                 
        `;
}

// display date
function displayDate() {
    return `
    <div class="mb-4">
             <p><span class="key">current date: </span>${new Date().toLocaleDateString()}</p>
        </div>                 
        `;
}

// display contact form
function displayContactDetails() {
    return `
asfdsdf    
    `;
}

// display history
function displayHistory() {
    return `<div class="my-4">
        <h2 class="text-[16.5px] sm:text-xl my-2 font-bold">your history: </h2>
        <ul class="mb-4">
            ${historyInput.length === 0
            ? '<li class="text-[16px] string">no history found</li>'
            : ""
        }
            ${historyInput
            .map(
                (input, index) =>
                    `<li class="text-[14px] sm:text-[16px]"><span class="key">▸</span> ${input}</li>`
            )
            .join("")}
        </ul>
    </div>
    `;
}

// remove history
function removeHistory() {
    historyInput = [];
    saveHistory(historyInput);
    historyIndex = -1;
    addOutput("history cleared successfully", "success");
    return "";
}

// display theme
function displayThemes() {
    return `
    <div class="mb-4">
        <div class="my-2 text-[14px] sm:text-[16px]">
            <span class="text-[16.5px] sm:text-[18px] font-bold">available themes:</span>
            ${Object.keys(themes)
            .map((theme) => `<span class="key">${theme}</span>`)
            .join(", ")}
        </div>
        <div class="my-2">
            <p>
                <span class="key">usage:</span>
                theme set theme-name
            </p>
            <p>
                <span class="key">eg:</span>
                theme <span class="string">set</span>
                dracula
            </p>
        </div>
    </div>
    `;
}

// go to gui portfolio
function goToGuiPortfolio() {
    const url = "https://portfolio-akkal.vercel.app/";
    window.open(url, "_blank");
    addOutput(`opening gui portfolio successfully`, "success");
    return "";
}

// scroll to bottom
function scrollToBottom() {
    history.scrollTop = history.scrollHeight;
}

// Add ASCII art loader
function showLoader() {
    const loader = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
    let i = 0;
    const loaderElement = document.createElement("div");
    loaderElement.className = "loader";
    history.appendChild(loaderElement);

    const loaderInterval = setInterval(() => {
        loaderElement.textContent = `${loader[i++]} fetching data...`;
        i %= loader.length;
    }, 100);

    return () => {
        clearInterval(loaderInterval);
        loaderElement.remove();
    };
}

// joke logic
async function displayJoke() {
    try {
        // https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit
        const response = await fetch(
            "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
        );
        const data = await response.json();
        return data.setup
            ? `
        <div class="my-3">
            <h3 class="font-bold my-2 text-[16.5px] sm:text-[18px]">
                joke of the day:
            </h3>
            <p class="mb-2 key text-[14px] sm:text-[16px]">${data.setup}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]">${data.delivery}</p>
        </div>
        `
            : `
        <div class="my-3">
           <h3 class="font-bold my-2 text-[16.5px] sm:text-[18px]">
                joke of the day:
            </h3>
            <p class="mb-2 key text-[14px] sm:text-[16px]">${data.joke}</p>
        </div>
        `;
    } catch (error) {
        return "why did the developer go broke? bad cache!";
    }
}

// weather logic
async function displayWeather(location) {
    changeTheme(currentTheme);
    if (!location)
        return `
    <div class="my-3">
        <h2 class="text-[16.5px] sm:text-xl font-bold">weather command: </h2>
        <p class="text-[14px] sm:text-[16px]">please specify location: <span class="string">weather</span> location-name</p>
        <p class="text-[14px] sm:text-[16px]"><span class="key">eg: </span><span class="string">weather</span> kathmandu</p>
    </div>
    `;

    try {
        const apiKey = "27cfc8d0c4b8df5f08069ec450b5cff7"; // Get from openweathermap.org
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        if (data.cod === 200) {
            return `
               <div class="my-3">
                    <h3 class="font-bold text-[18px] sm:text-xl">weather in <span class="string">${data.name.toLowerCase()}</span>:</h3>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-2">
                        <span class="key">▸ temperature:</span><span>${data.main.temp
                }°C</span>
                        <span class="key">▸ description:</span><span>${data.weather[0].description
                }</span>
                        <span class="key">▸ humidity:</span><span>${data.main.humidity
                }%</span>
                        <span class="key">▸ wind speed:</span><span>${data.wind.speed
                }m/s</span>
                        <span class="key">▸ pressure:</span><span>${(
                    data.main.pressure / 1013.25
                ).toFixed(3)}atm</span>
                        <span class="key">▸ sunrise:</span><span>${new Date(
                    data.sys.sunrise * 1000
                ).toLocaleTimeString()}</span>
                        <span class="key">▸ sunset:</span><span>${new Date(
                    data.sys.sunset * 1000
                ).toLocaleTimeString()}</span>
                    </div>
               </div>
            `;
        }
        return "location not found";
    } catch (error) {
        return "weather service unavailable";
    }
}

// guest location logic
async function displayGuestLocation() {
    changeTheme(currentTheme);
    const url = 'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'cf4f4c72eamsh065efa2a0112b62p1ea0d1jsn72174e23d7be',
            'x-rapidapi-host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch('https://ipinfo.io/json?token=4ba422932856fb');
        const data = await response.json();
        const response2 = await fetch(url, options);
        const result = await response2.json();
        if (response.status === 200 && response.ok && response2.status === 200 && response2.ok) {
            return `
        <div class="my-3">
            <h3 class="font-bold my-2 text-[16.5px] sm:text-xl">your location:</h3>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">ip:</span> ${data.ip || result.ip}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">continent:</span> ${result.continent.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">country:</span> ${result.country.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">country capital:</span> ${result.countryCapital.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">timezone:</span> ${data.timezone.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">city:</span> ${data.city.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">region:</span> ${data.region.toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">latitude:</span> ${data.loc.split(",")[0].toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">longitude:</span> ${data.loc.split(",")[1].toLowerCase()}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]"><span class="key">${data.company.type === "isp" ? "isp" : "organization"}:</span> ${data.company.name.toLowerCase()}</p>
        </div>
        
        `
        } else {
            return "location not found";
        }
    } catch (error) {
        console.log(error);
        return "location service unavailable";
    }
}

// location logic
async function displayLocation() {
    changeTheme(currentTheme);
    const url = 'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'cf4f4c72eamsh065efa2a0112b62p1ea0d1jsn72174e23d7be',
            'x-rapidapi-host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch('https://ipinfo.io/json?token=4ba422932856fb');
        const data = await response.json();
        const response2 = await fetch(url, options);
        const result = await response2.json();
        if (response.status === 200 && response.ok && response2.status === 200 && response2.ok) {
            return `
        <div class="my-3">
            <p class="font-bold my-2  text-[14px] sm:text-[16px]">
                <span class="key">your location:</span>
                <span class="string">${data.city.toLowerCase()} ${result.country.toLowerCase()} ${result.continent.toLowerCase()}</span>
            </p>
            
        </div>
        
        `
        } else {
            return "location not found";
        }
    } catch (error) {
        console.log(error);
        return "location service unavailable";
    }
}

// guest ip logic
async function displayGuestIP() {
    changeTheme(currentTheme);
    const url = 'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'cf4f4c72eamsh065efa2a0112b62p1ea0d1jsn72174e23d7be',
            'x-rapidapi-host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch('https://ipinfo.io/json?token=4ba422932856fb');
        const data = await response.json();
        const response2 = await fetch(url, options);
        const result = await response2.json();
        if (response.status === 200 && response.ok && response2.status === 200 && response2.ok) {
            return `
        <div class="my-3">
            <p class="font-bold my-2  text-[14px] sm:text-[16px]">
                <span class="key">your ip:</span>
                <span class="string">${data.ip || result.ip}</span>
            </p>
            
        </div>
        
        `
        } else {
            return "location not found";
        }
    } catch (error) {
        console.log(error);
        return "location service unavailable";
    }
}

// quote logic
async function displayQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        return `
        <div class="my-3">
            <h3 class="font-bold my-2 text-xl">quote:</h3>
            <p class="mb-2 key text-[14px] sm:text-[16px]">${data.author}</p>
            <p class="mb-2 text-[14px] sm:text-[16px]">${data.content}</p>
        </div>
        `;
    } catch (error) {
        return "oops! something went wrong";
    }
}

// open cv
function openCV() {
    const cvUrl = "./WebDeveloperResume.pdf";
    const newTab = window.open(cvUrl, "_blank", "noopener,noreferrer");
    if (newTab) {
        newTab.opener = null;
    }
    return `
    <div class="my-3">
        <p class="mb-2 text-[14px] sm:text-[16px]">opening cv in new tab...</p>
    </div>
    `;
}

// open my github
function openGithub() {
    const githubUrl = "https://github.com/AkkalDhami";
    const newTab = window.open(githubUrl, "_blank", "noopener,noreferrer");
    if (newTab) {
        newTab.opener = null;
    }
    return `
    <div class="my-3">
        <p class="mb-2 text-[14px] sm:text-[16px]">opening my github profile...</p>
    </div>
    `;
}

// download cv
function downloadCV() {
    const cvUrl = "./WebDeveloperResume.pdf";
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "WebDeveloperResume.pdf";
    link.click();
    return `
    <div class="my-3">
        <p class="mb-2 text-[14px] sm:text-[16px]">downloading cv...</p>
    </div>
    `;
}

// Terminal Functionality
const commands = {
    ls: () => showCommands(),
    'ls -a': () => showAllCommands(),
    help: () => showCommands(),
    'help -a': () => showAllCommands(),
    contact: () => {
        contactState.active = true;
        displayContactForm();
        return `
         <div class="mb-4">
                    <h2 text-[16.5px] sm:text-xl font-bold>contact me: </h2>
                    <div class="grid grid-cols-2 gap-x-1 text-wrap gap-y-2 text-[14px] sm:text-[16px] my-2">
                        <span class="key">▸ name</span><span>akkal dhami</span>
                        <span class="key">▸ email</span><span>akkaldhami21@gmail.com</span>
                        <span class="key">▸ contact</span><span>+977-9828122071</span>
                        <span class="key">▸ github</span><span><a target="_blank" href="https://github.com/AkkalDhami">https://github.com/AkkalDhami</a></span>
                    </div>
                </div>

               <div class="my-3 font-semibold">
                    <p class="text-[14px] sm:text-[16px]">type your '<span class="string">name</span>', '<span class="string">email</span>' and '<span class="string">message</span>' to fill the form.</p>
                    <div class="my-2 flex flex-col gap-1 text-wrap">
                        <p class="text-[14px] sm:text-[16px]">press <kbd class="string">ctrl</kbd> + <kbd class="string">x</kbd> to close the form.</p>
                        <p class="text-[14px] sm:text-[16px]">or</p>
                        <p class="text-[14px] sm:text-[16px]">type '<span class="string">exit</span>' or '<span class="string">close</span>' to close the form.</p>
                    </div>
               </div>

                <div class="my-3 font-semibold">use the following commands to navigate the form: </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:text-[16px] my-2">
                    <span class="key">▸ back</span><span>Go back</span>
                    <span class="key">▸ forward</span><span>Go forward</span>
                </div>
        `;
    },
    clear: clearTerminal,
    theme: () => displayThemes(),
    about: () => displayAbout(),
    skill: () => displaySkills(),
    project: () => displayProjects(),
    game: startGame,
    time: () => displayTime(),
    his: () => displayHistory(),
    "rm his": () => removeHistory(),
    gui: () => goToGuiPortfolio(),
    quote: displayQuote,
    weather: displayWeather,
    joke: displayJoke,
    "open cv": () => openCV(),
    "download cv": () => downloadCV(),
    date: () => displayDate(),
    whoami: () => displayAbout(),
    'my loc': displayLocation,
    'my loc -a': displayGuestLocation,
    'my ip': displayGuestIP,
    github: () => openGithub(),
};

// Array of sentences to display with typing effect
const hackingTexts = [
    "initializing system...",
    "loading portfolio...",
    "connecting to server...",
    "authenticating user...",
    "fetching data...",
    "loading commands...",
    "ready to use...",
];

//  typing effect
async function typeText(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                resolve();
            }
        }, speed);
    });
}

// Function to simulate deleting text
async function deleteText(element, speed = 10) {
    return new Promise((resolve) => {
        const deletingInterval = setInterval(() => {
            if (element.textContent.length > 0) {
                element.textContent = element.textContent.slice(0, -1);
            } else {
                clearInterval(deletingInterval);
                resolve();
            }
        }, speed);
    });
}

// Main function to display hacking effect
async function hackingEffect() {
    changeTheme(currentTheme);
    const terminal = document.getElementById("history");
    const typingElement = document.createElement("div");
    typingElement.className = "typing-effect sm:text-[20px] text-[16px]";
    terminal.appendChild(typingElement);

    for (const text of hackingTexts) {
        await typeText(typingElement, text); // Type the text
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await deleteText(typingElement);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await typeText(
        typingElement,
        "type 'help' or 'ls' to see available commands"
    );
    typingElement.classList.add("string");
    document.querySelector("#portfolio-title").classList.add("flex");
    document.querySelector("#portfolio-title").classList.remove("hidden");
    document.querySelector("#portfolio-title").classList.add("lg:hidden");

}

// Start the effect when the page loads

window.onload = hackingEffect;

// Clear Terminal
function clearTerminal() {
    history.innerHTML = "";
    return "";
}

// save history
function saveHistory(history) {
    localStorage.setItem("history", JSON.stringify(history));
}

// Terminal Logic
const history = document.getElementById("history");
const input = document.getElementById("input");

let historyInput = localStorage.getItem("history")
    ? JSON.parse(localStorage.getItem("history"))
    : [];
let historyIndex = -1;

input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            input.value = historyInput[--historyIndex];
        } else if (historyIndex === 0) {
            input.value = historyInput[historyIndex];
        }
    }
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < historyInput.length - 1) {
            input.value = historyInput[++historyIndex];
        } else if (historyIndex === historyInput.length - 1) {
            historyIndex++;
            input.value = "";
        }
    }
});

function addOutput(message, type = "info") {
    const output = document.createElement("div");
    output.className = `output my-2 terminal - font ${type === "error"
        ? "text-[#e50b0b]"
        : type === "success"
            ? "text-[#00ff00]"
            : ""
        } `;
    output.innerHTML = message;

    history.appendChild(output);

    history.scrollTop = history.scrollHeight;
}

function setTheme(theme) {
    changeTheme(theme);
}

// Process Command
async function processCommand(cmd) {
    if (cmd.startsWith("weather ")) {
        const location = cmd.split("weather ")[1];
        changeTheme(currentTheme);
        addOutput(await commands.weather(location));
        return;
    }

    if (cmd.startsWith("theme set ")) {
        const themeName = cmd.split("theme set ")[1].trim();
        if (themes[themeName]) {
            changeTheme(themeName);
            addOutput(`theme changed to ${themeName}`, "success");
        } else {
            addOutput(`invalid theme: ${themeName}`, "error");
            addOutput(
                `<span class='key'>available themes:</span> ${Object.keys(themes).join(
                    ", "
                )} `,
                "info"
            );
            changeTheme(currentTheme);
        }
        scrollToBottom();
        return;
    }

    if (gameState.active) {
        if (cmd === "exit" || cmd === "quit") {
            addOutput("game closed successfully", "info");
            resetGameState();
            return;
        }
        if (gameState.setup) {
            handleGameSetup(cmd);
        } else {
            handleGamePlay(cmd);
        }
        changeTheme(currentTheme);
        scrollToBottom();
        return;
    }

    if (contactState.active) {
        if (cmd === "back") {
            handleBackward();
            changeTheme(currentTheme);
            scrollToBottom();
            return;
        }
        if (cmd === "forward") {
            handleForward();
            changeTheme(currentTheme);
            scrollToBottom();
            return;
        }

        if (contactState.currentStep === contactState.steps.length - 1) {
            if (cmd === "submit") {
                submitContactForm();
            } else {
                addOutput(
                    "type '<span class='string'>submit</span>' to send message or '<span class='string'>back</span>' to edit fields",
                    "error"
                );
            }
            changeTheme(currentTheme);
            scrollToBottom();
            return;
        }
        handleContactInput(cmd);
        changeTheme(currentTheme);
        scrollToBottom();
        return;
    }

    if (commands[cmd]) {
        const result =
            typeof commands[cmd] === "function"
                ? await commands[cmd]()
                : commands[cmd];
        addOutput(result);
        changeTheme(currentTheme);
    } else if (cmd) {
        addOutput(` command not found: ${cmd} `, "error");
        addOutput(
            `type '<span class='string'>help</span>' or '<span class='string'>ls</span>' to see available commands`,
            "info"
        )
        changeTheme(currentTheme);
    }
    scrollToBottom();
    changeTheme(currentTheme);
}

// Add keyboard shortcut handler
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        input.value = "";
        if (contactState.active) {
            resetContactState();
            displayDefaultPrompt();
            addOutput("contact form closed successfully", "info");
        }
        if (gameState.active) {
            resetGameState();
            displayDefaultPrompt();
            addOutput("game closed successfully", "info");
        }
        changeTheme(currentTheme);
    }
});
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "q") {
        clearTerminal();
    }
});

function addCommandToHistory(cmd) {
    const commandLine = document.createElement("div");
    commandLine.className = "command mb-2 terminal-font opacity-70";
    commandLine.innerHTML = `<span class="mr-2" >➜</span> ${cmd} `;
    history.appendChild(commandLine);
}

// Event Listeners
input.addEventListener("keypress", async (e) => {
    if (e.target.value === "") {
        return;
    }
    if (e.key === "Enter") {
        const cmd = input.value.trim().toLowerCase();
        addCommandToHistory(cmd);

        const stopLoader = showLoader();
        if (cmd) {
            await processCommand(cmd);
            stopLoader();
            input.value = "";
            historyInput.push(cmd);
            saveHistory(historyInput);
            historyIndex = historyInput.length - 1;
            console.log(historyInput);
            scrollToBottom();
        }
    }
});

// Animation Loop
function animate() {
    drawBinaryBackground();
    requestAnimationFrame(animate);
}

// Initial Setup
resizeCanvas();
animate();
changeTheme("default");
window.addEventListener("resize", resizeCanvas);
document.addEventListener("click", () => input.focus());

// function typeWriter(text, element, speed = 80) {
//     let i = 0;
//     const typing = setInterval(() => {
//         const currentChar = text.charAt(i);
//         if (currentChar === '<') {
//             const endTagIndex = text.indexOf('>', i);
//             if (endTagIndex !== -1) {
//                 element.innerHTML += text.substring(i, endTagIndex + 1);
//                 i = endTagIndex + 1;
//             }
//         } else {
//             element.innerHTML += currentChar;
//             i++;
//         }
//         if (i >= text.length) clearInterval(typing);
//     }, speed);
// }

// document.getElementById('terminal-title').innerHTML = '';
// document.getElementById('portfolio-title').innerHTML = '';

// typeWriter('<span class="key">welcome</span> to my terminal portfolio!', document.getElementById('terminal-title'));
// typeWriter('Hello, I am <span class="string">Akkal Dhami</span>', document.getElementById('portfolio-title'));
