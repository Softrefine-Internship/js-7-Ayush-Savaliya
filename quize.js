let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let answeredQuestions = []; 


function fetchQuizData(url)
{
  fetch(url)
    .then(response => response.json())
    .then(data =>
    {
      questions = data.results;
      console.log(data);
      displayQuestion();
      updatePagination();  
    })
    .catch(error =>
    {
      console.error('Error fetching quiz data:', error);
    });
}

function displayQuestion()
{
  const question = questions[currentQuestionIndex];
  document.getElementById('questionText').innerHTML = question.question;
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';  

  const correctAnswerText = document.getElementById('correctAnswerText');
  if (correctAnswerText) {
    correctAnswerText.remove();
  }

  const allOptions = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(allOptions);
  allOptions.forEach((option) =>
  {
    const optionBtn = document.createElement('button');
    optionBtn.innerHTML = option;
    optionBtn.classList.add('option-btn');
    optionBtn.addEventListener('click', () => checkAnswer(option, question.correct_answer, optionBtn));
    optionsContainer.appendChild(optionBtn);


    if (answeredQuestions[currentQuestionIndex]) {
      optionBtn.disabled = true;
      if (answeredQuestions[currentQuestionIndex].selected === option) {
        optionBtn.classList.add(answeredQuestions[currentQuestionIndex].correct ? 'correct' : 'incorrect');
      }

      if (answeredQuestions[currentQuestionIndex].correct && option === question.correct_answer) {
        optionBtn.classList.add('correct');
      }
    }
  });

  
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = questions.length;

  
  document.getElementById('nextBtn').textContent = (currentQuestionIndex === questions.length - 1) ? "Submit" : "Next Question";

  updatePagination();   
}

 
function shuffleArray(array)
{
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

 
function checkAnswer(selectedAnswer, correctAnswer, optionBtn)
{
  if (!answeredQuestions[currentQuestionIndex]) {
  
    if (selectedAnswer === correctAnswer) {
      score += 1;
      document.getElementById('score').textContent = score;
      optionBtn.classList.add('correct');
      answeredQuestions[currentQuestionIndex] = { selected: selectedAnswer, correct: true };
    } else {
      optionBtn.classList.add('incorrect');
      displayCorrectAnswer(correctAnswer);
      const options = document.querySelectorAll('.option-btn');
      options.forEach(option =>
      {
        if (option.textContent === correctAnswer) {
          option.classList.add('correct');
        }
      });
      answeredQuestions[currentQuestionIndex] = { selected: selectedAnswer, correct: false };
    }

     
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => option.disabled = true);
  }
}

 
function displayCorrectAnswer(correctAnswer)
{
  const correctAnswerText = document.createElement('p');
  correctAnswerText.id = 'correctAnswerText';
  correctAnswerText.innerHTML = `Correct Answer: ${correctAnswer}`;
  correctAnswerText.style.color = 'white';
  document.getElementById('questionContainer').appendChild(correctAnswerText);
}

 
function nextQuestion()
{
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    endQuiz();
  }
}
 
function endQuiz()
{
  // alert(`Quiz completed! Your final score is ${score}`);
  window.location.href = "result.html?score=" + score;
}

 
function getQueryParams()
{
  const params = new URLSearchParams(window.location.search);
  console.log(params)
  return {
    url: params.get('url')
  };
}

 
function updatePagination()
{
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';  
  const totalQuestions = questions.length;
  const range = 5; 
  const start = Math.max(0, currentQuestionIndex - Math.floor(range / 2));
  const end = Math.min(totalQuestions, start + range);

  for (let i = start; i < end; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i + 1;
    pageBtn.classList.add('page-btn');
    if (i === currentQuestionIndex) {
      pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () =>
    {
      currentQuestionIndex = i;
      displayQuestion();
      updatePagination();  
    });
    paginationContainer.appendChild(pageBtn);
  }
}

document.addEventListener('DOMContentLoaded', function ()
{
  if (window.location.pathname.includes('test.html')) {
    const queryParams = getQueryParams();
    if (queryParams.url) {
      fetchQuizData(decodeURIComponent(queryParams.url));

      
      document.getElementById('nextBtn').addEventListener('click', () =>
      {
        nextQuestion();
        updatePagination();  
      });

      
      document.getElementById('quitBtn').addEventListener('click', endQuiz);
    }
  }
});