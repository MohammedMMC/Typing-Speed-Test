const textContainer = document.querySelector(".content .text p");
const inputField = document.querySelector(".container input");

const mistakesSpan = document.querySelector(".content .data .results .mistakes span");
const wpmSpan = document.querySelector(".content .data .results .wpm span");
const cpmSpan = document.querySelector(".content .data .results .cpm span");
const timeSpan = document.querySelector(".content .data .results .time span b");

let letterIndex = 0, mistakes = 0,
    maxTime = 30, timeLeft = maxTime;
let timers = [];

// Returns a random paragraph
const getRandomParagraph = () => paragraphs[Math.floor(Math.random() * paragraphs.length)];

function newGame() {
    letterIndex = 0; mistakes = 0;
    maxTime = 30; timeLeft = maxTime;
    inputField.value = "";
    timers.forEach(clearInterval)
    timers = [];
    const paragraph = getRandomParagraph();
    textContainer.innerHTML = paragraph.split("").map(l => `<span>${l}</span>`).join("");
    textContainer.querySelectorAll("span")[0].classList.add("next");
    timeSpan.textContent = timeLeft;
    mistakesSpan.textContent = 0;
    cpmSpan.textContent = 0;
    wpmSpan.textContent = 0;
}

document.addEventListener("keydown", () => timeLeft <= 0 ? inputField.blur() : inputField.focus());
textContainer.addEventListener("click", () => timeLeft <= 0 ? inputField.blur() : inputField.focus());
inputField.addEventListener("input", onInput);
inputField.addEventListener("copy", (e) => e.preventDefault());
inputField.addEventListener("paste", (e) => e.preventDefault());
inputField.addEventListener("cut", (e) => e.preventDefault());
inputField.addEventListener("contextmenu", (e) => e.preventDefault());
inputField.addEventListener("keydown", (e) => {
    if (
        (e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x", "z", "y"].includes(e.key.toLowerCase())
    ) {
        e.preventDefault();
    }
});

function onInput() {
    if (timeLeft <= 0) return;
    const letters = textContainer.querySelectorAll("span");
    const inputText = inputField.value.split("");

    if (letterIndex === 0 && timeLeft === maxTime) {
        let timeInterval = setInterval(() => refreshTime(timeInterval), 1000);
        timers.push(timeInterval);
    }


    for (let i = inputText.length; i < letterIndex; i++) {
        // if (letters[i].classList.contains("incorrect")) mistakes--;
        letters[i].classList.remove("correct", "incorrect", "next");
    }

    letterIndex = inputText.length - 1;

    const currentLetter = inputText[letterIndex];
    if (currentLetter !== undefined) {
        letters[letterIndex].classList.add(letters[letterIndex].textContent === currentLetter ? "correct" : "incorrect");
        // if (letters[letterIndex].textContent !== currentLetter) mistakes++;
        letterIndex++;
    }

    mistakes = [...letters.values()].filter(s => s.classList.contains("incorrect")).length;

    letters.forEach(s => s.classList.remove("next"));
    letters[letterIndex].classList.add("next");

    mistakesSpan.textContent = mistakes;
    cpmSpan.textContent = letterIndex - mistakes;

    let wpm = Math.round((((letterIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    wpmSpan.textContent = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
}

function refreshTime(timeInterval) {
    if (timeLeft > 0) {
        timeSpan.textContent = --timeLeft;
    } else {
        clearInterval(timeInterval);
    }
}

window.onload = newGame;