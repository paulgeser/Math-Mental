document.addEventListener("DOMContentLoaded", () => {
    const startButtons = document.querySelectorAll(".exercise-option");
    const returnButton = document.getElementById("return");
    const soundCheckbox = document.getElementById("sound");
    const menuArea = document.getElementById("menu");
    const exerciseArea = document.getElementById("exercise");
    const exerciseDisplay = document.getElementById("exercise-display");
    const exerciseInput = document.getElementById("exercise-input");
    const numberPad = document.getElementById("numberpad");

    let exercises = [];
    let currentExerciseIndex = 0;
    let userInput = "";

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createExercises(type, amount) {
        const exercises = [];
        for (let i = 0; i < amount; i++) {
            let number1, number2, operator, result, display;
            switch (type) {
                case "addition-subtraction":
                    number1 = getRndInteger(2, 150);
                    number2 = getRndInteger(2, 150);
                    operator = getRndInteger(0, 1) ? '+' : '-';
                    result = operator === '+' ? number1 + number2 : number1 - number2;
                    display = `${number1} ${operator} ${number2}`;
                    break;
                case "multiplication-division":
                    number1 = getRndInteger(2, 20);
                    number2 = getRndInteger(2, 20);
                    operator = getRndInteger(0, 1) ? '*' : '/';
                    result = operator === '*' ? number1 * number2 : (number1 % number2 === 0 ? number1 / number2 : null);
                    display = `${number1} ${operator} ${number2}`;
                    break;
                case "large-addition-subtraction":
                    number1 = getRndInteger(100, 1000);
                    number2 = getRndInteger(100, 1000);
                    operator = getRndInteger(0, 1) ? '+' : '-';
                    result = operator === '+' ? number1 + number2 : number1 - number2;
                    display = `${number1} ${operator} ${number2}`;
                    break;
                case "large-multiplication-division":
                    number1 = getRndInteger(10, 50);
                    number2 = getRndInteger(10, 50);
                    operator = getRndInteger(0, 1) ? '*' : '/';
                    result = operator === '*' ? number1 * number2 : (number1 % number2 === 0 ? number1 / number2 : null);
                    display = `${number1} ${operator} ${number2}`;
                    break;
                case "square":
                    number1 = getRndInteger(1, 30);
                    operator = getRndInteger(0, 1) ? '^2' : '^3';
                    result = operator === '^2' ? number1 ** 2 : number1 ** 3;
                    display = `${number1}${operator}`;
                    break;
            }
            if (result !== null) {
                exercises.push({ display, result });
            }
        }
        return exercises;
    }

    function speakExercise(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "de-DE";
        speechSynthesis.speak(utterance);
    }

    function showExercise() {
        if (currentExerciseIndex >= exercises.length) {
            exerciseDisplay.innerHTML = "<b>Geschafft! Alle Aufgaben erledigt.</b>";
            return;
        }
        const currentExercise = exercises[currentExerciseIndex].display;
        if (soundCheckbox.checked) {
            exerciseDisplay.innerHTML = "-";
            speakExercise(currentExercise);
            exerciseInput.innerHTML = " = " + userInput;
        } else {
            exerciseDisplay.innerHTML = currentExercise;
            exerciseInput.innerHTML = " = " + userInput;
        }
    }

    function handleNumberInput(value) {
        if (value === "Del") {
            userInput = userInput.slice(0, -1);
        } else if (value === "+/-") {
            userInput = userInput.startsWith("-") ? userInput.slice(1) : "-" + userInput;
        } else if (value === "Submit") {
            checkAnswer();
        } else {
            userInput += value;
        }
        showExercise();
    }

    function checkAnswer() {
        if (parseInt(userInput) === exercises[currentExerciseIndex].result) {
            alert("Richtig!");
        } else {
            alert("Falsch! Die richtige Antwort war " + exercises[currentExerciseIndex].result);
        }
        userInput = "";
        currentExerciseIndex++;
        showExercise();
    }

    startButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const type = event.target.getAttribute("data-type");
            exercises = createExercises(type, 10);
            currentExerciseIndex = 0;
            userInput = "";
            menuArea.hidden = true;
            exerciseArea.hidden = false;
            showExercise();
        });
    });

    returnButton.addEventListener("click", () => {
        menuArea.hidden = false;
        exerciseArea.hidden = true;
    });

    numberPad.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            handleNumberInput(event.target.innerText);
        }
    });
});
