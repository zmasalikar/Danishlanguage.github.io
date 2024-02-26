let currentQuestion = 0;
let score = 0;
let data;
let answeredQuestions = [];

function loadQuestion() {
  const questionDiv = document.getElementById("question");
  const optionsDiv = document.getElementById("options");
  const resultDiv = document.getElementById("result");

  // Clear previous question and options
  questionDiv.innerHTML = "";
  optionsDiv.innerHTML = "";
  resultDiv.innerHTML = "";

  // Display current question
  questionDiv.innerHTML = data[currentQuestion].danish;

  // Display options
  const options = [
    { text: data[currentQuestion].english, isCorrect: true },
    { text: getWrongOption(), isCorrect: false },
    { text: getWrongOption(), isCorrect: false },
    { text: getWrongOption(), isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.innerText = option.text;
    optionDiv.addEventListener("click", () => checkAnswer(option.isCorrect, optionDiv));
    optionsDiv.appendChild(optionDiv);
  });
}

function getWrongOption() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * data.length);
  } while (randomIndex === currentQuestion || answeredQuestions.includes(randomIndex));

  answeredQuestions.push(randomIndex);

  return data[randomIndex].english;
}

function checkAnswer(isCorrect, optionDiv) {
  const resultDiv = document.getElementById("result");

  if (isCorrect) {
    score++;
    resultDiv.innerText = "Correct!";
    resultDiv.style.color = "green";
    optionDiv.classList.add("correct");
  } else {
    resultDiv.innerText = "Incorrect!";
    resultDiv.style.color = "red";
    optionDiv.classList.add("incorrect");
    const correctOption = Array.from(optionsDiv.children).find(option => option.innerText === data[currentQuestion].english);
    correctOption.classList.add("correct");
    correctOption.classList.add("shake");
    setTimeout(() => {
      correctOption.classList.remove("shake");
    }, 500);
  }

  currentQuestion++;
  if (currentQuestion < data.length) {
    setTimeout(() => loadQuestion(), 1000); // Load next question after 1 second
  } else {
    endQuiz();
  }

  updateStats();
}

function endQuiz() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = `Quiz ended! Your score: ${score} out of ${data.length}`;
  resultDiv.style.color = "black";
}

function updateStats() {
  const totalQuestionsSpan = document.getElementById("totalQuestions");
  const correctAnswersSpan = document.getElementById("correctAnswers");
  const percentileSpan = document.getElementById("percentile");

  totalQuestionsSpan.textContent = data.length;
  correctAnswersSpan.textContent = score;
  percentileSpan.textContent = `${((score / data.length) * 100).toFixed(2)}%`;
}

// Load data from JSON file
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'data.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) {
      data = JSON.parse(xobj.responseText);
      loadQuestion();
      updateStats();
    }
  };
  xobj.send(null);
}

loadJSON();
