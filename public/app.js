document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('exercise-list-body');
  const form = document.getElementById('exercise-form');

  const loadExercises = async () => {
    const res = await fetch('/api/exercises');
    const data = await res.json();
    tableBody.innerHTML = ''; // Clear the existing rows
    data.forEach(ex => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ex.name}</td>
        <td>${ex.type}</td>
        <td>${ex.duration}s</td>
        <td>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${ex.id}">
            Remove
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEx = {
      name: document.getElementById('name').value,
      type: document.getElementById('type').value,
      description: document.getElementById('description').value,
      duration: parseInt(document.getElementById('duration').value) || 0
    };
    await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEx)
    });
    form.reset();
    // No need for M.updateTextFields() as it's a Materialize-specific function
    loadExercises();
  });

  tableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      await fetch(`/api/exercises/${id}`, { method: 'DELETE' });
      loadExercises();
    }
  });

  loadExercises();
});