document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos(filter = "all") {
    todoList.innerHTML = "";

    let filteredTodos = todos.filter(todo => {
      if (filter === "pending") return !todo.completed;
      if (filter === "complete") return todo.completed;
      return true; // "all"
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `<tr><td colspan="4" class="no-task">No task found</td></tr>`;
      return;
    }

    filteredTodos.forEach((todo, index) => {
      let row = document.createElement("tr");

      row.innerHTML = `
        <td>${todo.task}</td>
        <td>${todo.date}</td>
        <td>
          <input type="checkbox" ${todo.completed ? "checked" : ""} data-index="${index}">
        </td>
        <td>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;

      todoList.appendChild(row);
    });
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let task = todoInput.value.trim();
    let date = dateInput.value;

    if (task === "" || date === "") {
      alert("Please enter task and due date!");
      return;
    }

    todos.push({ task, date, completed: false });
    saveTodos();
    todoInput.value = "";
    dateInput.value = "";
    renderTodos(filterSelect.value);
  });

  todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      let index = e.target.getAttribute("data-index");
      todos.splice(index, 1);
      saveTodos();
      renderTodos(filterSelect.value);
    }

    if (e.target.type === "checkbox") {
      let index = e.target.getAttribute("data-index");
      todos[index].completed = e.target.checked;
      saveTodos();
      renderTodos(filterSelect.value);
    }
  });

  filterSelect.addEventListener("change", () => {
    renderTodos(filterSelect.value);
  });

  deleteAllBtn.addEventListener("click", () => {
    todos = [];
    saveTodos();
    renderTodos(filterSelect.value);
  });

  renderTodos(filterSelect.value);
});
