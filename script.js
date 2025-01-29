document.addEventListener('DOMContentLoaded', function ()
{
  fetchCategories();

  document.getElementById('quizSettingsForm').addEventListener('submit', function (event)
  {
    event.preventDefault();

    const numQuestions = document.getElementById('numQuestions').value;
    const category = document.getElementById('category').value;
    const questionType = document.getElementById('questionType').value;
    const difficulty = document.getElementById('difficulty').value;

    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=${questionType}`;

    window.location.href = `test.html?url=${encodeURIComponent(url)}`;
  });
});

function fetchCategories()
{
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data =>
    {
      const categorySelect = document.getElementById('category');
      categorySelect.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select a Category';
      categorySelect.appendChild(defaultOption);

      data.trivia_categories.forEach(category =>
      {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch(error =>
    {
      console.error('Error fetching categories:', error);
      const categorySelect = document.getElementById('category');
      categorySelect.innerHTML = '<option value="">Failed to load categories</option>';
    });
}
