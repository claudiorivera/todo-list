document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#buttonSubmit").addEventListener("click", submitTask);
  refreshList();
});

async function refreshList() {
  // Empty the list container
  const tasksListContainer = document.querySelector("#tasksDisplay");
  while (tasksListContainer.firstChild) {
    tasksListContainer.removeChild(tasksListContainer.lastChild);
  }

  // Get data from server
  const response = await fetch("/tasks");
  const tasks = await response.json();

  // Create UL list group
  const ul = document.createElement("ul");
  ul.classList.add("list-group");

  tasks.forEach(({ id, task_description, task_iscomplete }) => {
    // Create LI item
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.setAttribute("data-id", id);

    // Create text node
    let text = document.createTextNode(`${task_description}`);

    // Strike through if the task is complete
    if (task_iscomplete) {
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

    // Click listener
    li.addEventListener("click", toggleComplete);
  });
  // Append UL to taskListContainer
  tasksListContainer.appendChild(ul);
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
      document.querySelector("#inputText").value = "";
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
