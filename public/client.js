document.addEventListener("DOMContentLoaded", () => {
  refreshList();
});

function refreshList() {
  // Target list container
  const tasksListContainer = document.querySelector("#tasksDisplay");

  // Get data from server
  fetch("/tasks")
    .then((response) => {
      return response.json();
    })
    .then((tasks) => {
      // Create UL list group
      const ul = document.createElement("ul");
      ul.classList.add("list-group");

      tasks.forEach((task) => {
        // Create LI items
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        if (task.task_complete) {
          // Create text node with strikethrough
          const strikeText = document.createElement("s");
          const text = document.createTextNode(`${task.task_description}`);
          strikeText.appendChild(text);
          // Append text node to LI
          li.appendChild(strikeText);
          // Attach event listener
        } else {
          // Create text node without strikethrough
          const text = document.createTextNode(`${task.task_description}`);
          // Append text node to LI
          li.appendChild(text);
          // Attach event listener
        }
        // Append LI to UL
        ul.appendChild(li);
      });

      // Append UL to taskListContainer
      tasksListContainer.appendChild(ul);
    });
}
