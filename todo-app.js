(() => {
  let idTodo = 0;
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    const appTitle = document.createElement("h1");
    appTitle.className = "header";
    appTitle.innerHTML = title;
    return appTitle;
  }
  //создаем и возвращаем форму для создания дела форма инпут див баттон
  function createTodoItemForm() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const buttonWrapper = document.createElement("div");
    const button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.setAttribute("id", "input");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    // button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }
  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }
  //создаем и возвращаем дело
  function createTodoItem(name) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let buttonDone = document.createElement("button");
    let buttonDelete = document.createElement("button");

    //Помещаем передаваемое название в элемент списка
    item.textContent = name;
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    buttonDone.classList.add("btn", "btn-success");
    buttonDelete.classList.add("btn", "btn-danger");
    buttonDone.textContent = "Готово";
    buttonDelete.textContent = "Удалить";

    //вкладываем кнопки в div для объединения
    buttonGroup.append(buttonDone);
    buttonGroup.append(buttonDelete);
    item.append(buttonGroup);

    return {
      item,
      buttonDone,
      buttonDelete,
    };
  }

  async function createTodoApp(container, title = "Список дел") {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    //перемещаем указатель мыши в форму
    // document.getElementById("input").focus();

    //определяем id списка кнопки
    todoItemForm.form.addEventListener("submit", async (e) => {
      //предотвращаем стандартное действие браузера при отправке формы (перезагрузка страницы)
      e.preventDefault();

      //игнорируем создание элемента если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      const response = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner: "Artur",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const todoItem = await response.json();

      const todoItemElement = createTodoItem(todoItem.name);

      //добавляем обработчик на кнопки
      todoItemElement.buttonDone.addEventListener("click", () => {
        todoItemElement.item.classList.toggle("list-group-item-success");
      });
      todoItemElement.buttonDelete.addEventListener("click", () => {
        if (confirm("Хотите удалить?")) {
          todoItemElement.item.remove();
        }
      });

      //создаем и добавляем в список (ul) новое дело (li) с названием из поля ввода фармы
      todoList.append(todoItemElement.item);

      //обнуляем значение в поле ввода формы, чтобы пользователь не стирал
      todoItemForm.input.value = "";
      // document.getElementById("input").focus();
      //   todoItemForm.button.disabled = true;
    });
  }
  //NEW
  //   async function loadTodoItems() {
  //     const response = await fetch("http://localhost:3000/api/todos");
  //     const data = await response.json();
  //     console.log(data);
  //   }

  //   async function createTodoItem() {
  //     const response = await fetch("http://localhost:3000/api/todos", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: "Сходить за хлебом",
  //         owner: "Тимофей",
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   }

  //   async function getTodoItem() {
  //     const response = await fetch(
  //       "http://localhost:3000/api/todos/1608029025426"
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   }

  //   async function markTodoAsDone() {
  //     const response = await fetch(
  //       "http://localhost:3000/api/todos/1608029025426",
  //       {
  //         method: "PATCH",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ done: true }),
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   }

  //   async function deleteTodoItem() {
  //     const response = await fetch(
  //       "http://localhost:3000/api/todos/1608029025426",
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     if (response.status === 404)
  //       console.log("Не удалось удалить дело, так как его не существует");
  //     const data = await response.json();
  //     console.log(data);
  //   }

  window.createTodoApp = createTodoApp;
})();
