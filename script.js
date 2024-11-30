const textContainer = document.querySelector(".content .text p");
const inputField = document.querySelector(".container input");

const mistakesSpan = document.querySelector(".content .data .results .mistakes span");
const wpmSpan = document.querySelector(".content .data .results .wpm span");
const cpmSpan = document.querySelector(".content .data .results .cpm span");
const timeSpan = document.querySelector(".content .data .results .time span b");

let letterIndex = 0, mistakes = 0,
    timer = 0, maxTime = 60, timeLeft = maxTime;

// Returns a random paragraph
const getRandomParagraph = () => paragraphs[Math.floor(Math.random() * paragraphs.length)];

function newGame() {
    const paragraph = getRandomParagraph();
    textContainer.innerHTML = paragraph.split("").map(l => `<span>${l}</span>`).join("");
}

document.addEventListener("keydown", () => inputField.focus());
textContainer.addEventListener("click", () => inputField.focus());
inputField.addEventListener("input", onInput)

function onInput() {
    const letters = textContainer.querySelectorAll("span");
    const writtenLetter = inputField.value.split("")[letterIndex];

    if (letterIndex === 0 && timeLeft === maxTime) {
        let timeInterval = setInterval(() => refreshTime(timeInterval), 1000);
    }

    if (writtenLetter == null) {
        letterIndex--;
        if (letters[letterIndex].classList.contains("incorrect")) mistakes--;
        letters[letterIndex].classList.remove("correct", "incorrect");
    } else {
        if (letters[letterIndex].textContent === writtenLetter) {
            letters[letterIndex].classList.add("correct");
        } else {
            mistakes++;
            letters[letterIndex].classList.add("incorrect");
        }
        letterIndex++;
    }
    letters.forEach(s => s.classList.remove("next"));
    letters[letterIndex].classList.add("next");

    mistakesSpan.textContent = mistakes;
    cpmSpan.textContent = letterIndex - mistakes;
}

function refreshTime(timeInterval) {
    if (timeLeft > 0) {
        timeLeft--;
        timeSpan.textContent = timeLeft;

        let wpm = Math.round((((letterIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpmSpan.textContent = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    } else {
        clearInterval(timeInterval);
    }
}

window.onload = newGame;