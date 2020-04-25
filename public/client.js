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
        // Create LI item
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        // Create text node
        let text = document.createTextNode(`${task.task_description}`);

        // Strike through if the task is complete
        if (task.task_complete) {
          // Add the data-complete: true attribute
          li.setAttribute("data-complete", true);
          const strikeText = document.createElement("s");
          strikeText.appendChild(text);
          // Append text node to LI
          li.appendChild(strikeText);
        } else {
          li.setAttribute("data-complete", false);
          li.appendChild(text);
        }

        // Event listener
        li.addEventListener("click", toggleComplete);

        // Append LI to UL
        ul.appendChild(li);
      });
      // Append UL to taskListContainer
      tasksListContainer.appendChild(ul);
    });
}

function toggleComplete(clickEvent) {
  console.log(clickEvent.target.dataset);
}
