document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('exercise-list-body');
  const form = document.getElementById('exercise-form');

  // Function to load and display exercises from the backend
  const loadExercises = async () => {
    try {
      const res = await fetch('/api/exercises');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      tableBody.innerHTML = ''; // Clear existing rows

      data.forEach(ex => {
        const row = document.createElement('tr');
        // Use ex._id for MongoDB documents
        row.innerHTML = `
          <td>${ex.name}</td>
          <td>${ex.type}</td>
          <td>${ex.duration}s</td>
          <td>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${ex._id}">
              Remove
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading exercises:', error);
      // Optionally display a user-friendly error message
    }
  };

  // Event listener for form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newEx = {
      name: document.getElementById('name').value,
      type: document.getElementById('type').value,
      description: document.getElementById('description').value,
      duration: parseInt(document.getElementById('duration').value) || 0 // Ensure duration is a number
    };

    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEx)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      form.reset(); // Clear the form fields
      loadExercises(); // Reload exercises to show the new one
    } catch (error) {
      console.error('Error adding exercise:', error);
      // Optionally display a user-friendly error message
    }
  });

  // Event listener for delete buttons (using event delegation)
  tableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id; // Get the MongoDB _id from data-id attribute

      try {
        const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        loadExercises(); // Reload exercises after deletion
      } catch (error) {
        console.error('Error deleting exercise:', error);
        // Optionally display a user-friendly error message
      }
    }
  });

  // Initial load of exercises when the page loads
  loadExercises();

  const socket = io();
  socket.on('counter', (value) => {
    document.getElementById('counter').textContent = value;
  });
});