document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#buttonSubmit").addEventListener("click", submitTask);
  refreshList();
});

function refreshList() {
  // Target list container and empty it
  const tasksListContainer = document.querySelector("#tasksDisplay");
  while (tasksListContainer.firstChild) {
    tasksListContainer.removeChild(tasksListContainer.lastChild);
  }

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
        li.setAttribute("data-id", task.id);

        // Create text node
        let text = document.createTextNode(`${task.task_description}`);

        // Strike through if the task is complete
        if (task.task_iscomplete) {
          // Add the data-complete: true attribute
          li.setAttribute("data-iscomplete", true);
          const strikeText = document.createElement("s");
          strikeText.appendChild(text);
          // Append text node to LI
          li.appendChild(strikeText);
        } else {
          li.setAttribute("data-iscomplete", false);
          li.appendChild(text);
        }

        // Append LI to UL
        ul.appendChild(li);
        // console.dir(li.dataset);

        li.addEventListener("click", toggleComplete);
      });
      // Append UL to taskListContainer
      tasksListContainer.appendChild(ul);
    });
}

function submitTask() {
  const task_description = document.querySelector("#inputText").value;
  const message = {
    task_description: `${task_description}`,
  };

  // Send message and then refresh
  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then(() => {
      refreshList();
    })
    .catch((error) => {
      console.error(error);
    });
}

function toggleComplete(clickEvent) {
  const data = clickEvent.currentTarget.dataset;
  if (data.iscomplete === "true") {
    const message = { task_iscomplete: "false" };
    // PUT - /tasks/:id - message task_iscomplete = false, and refresh
    // Send message and then refresh
    fetch(`/tasks/${Number(data.id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then(() => {
        refreshList();
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    const message = { task_iscomplete: "true" };

    // PUT - /tasks/:id - message task_iscomplete = false, and refresh
    // Send message and then refresh
    fetch(`/tasks/${Number(data.id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then(() => {
        refreshList();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
