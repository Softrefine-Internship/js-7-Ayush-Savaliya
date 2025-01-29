let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function fetchQuizData(url)
{
  fetch(url)
    .then(response => response.json())
    .then(data =>
    {
      questions = data.results;
      console.log(data);
      displayQuestion();
    })
    .catch(error =>
    {
      console.error('Error fetching quiz data:', error);
    });
}

function displayQuestion()
{
  const question = questions[currentQuestionIndex];
  document.getElementById('questionText').textContent = question.question;
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
    optionBtn.textContent = option;
    optionBtn.classList.add('option-btn');
    optionBtn.addEventListener('click', () => checkAnswer(option, question.correct_answer, optionBtn));
    optionsContainer.appendChild(optionBtn);
  });

  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = questions.length;
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
  if (selectedAnswer === correctAnswer) {
    score += 1;
    document.getElementById('score').textContent = score;
    optionBtn.classList.add('correct');
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
    
  }




  const options = document.querySelectorAll('.option-btn');
  options.forEach(option => option.disabled = true);
}


function displayCorrectAnswer(correctAnswer)
{
  const correctAnswerText = document.createElement('p');
  correctAnswerText.id = 'correctAnswerText';
  correctAnswerText.textContent = `Correct Answer: ${correctAnswer}`;
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
  alert(`Quiz completed! Your final score is ${score}`);
  window.location.href = "result.html?score=" + score;
}


function getQueryParams()
{
  const params = new URLSearchParams(window.location.search);
  return {
    url: params.get('url')
  };
}

document.addEventListener('DOMContentLoaded', function ()
{
  
  if (window.location.pathname.includes('test.html')) {
    const queryParams = getQueryParams();
    if (queryParams.url) {
      fetchQuizData(decodeURIComponent(queryParams.url));

      
      document.getElementById('nextBtn').addEventListener('click', nextQuestion);
      document.getElementById('quitBtn').addEventListener('click', endQuiz);
    }
  }
});
