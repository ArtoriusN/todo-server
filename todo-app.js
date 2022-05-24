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
    button.disabled = true;

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
  function createTodoItemElement(todoItem, { markTodoAsDone, deleteTodoItem }) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let buttonDone = document.createElement("button");
    let buttonDelete = document.createElement("button");

    //Помещаем передаваемое название в элемент списка
    item.textContent = todoItem.name;
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    //добавляем классы и текстовый контент
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    buttonDone.classList.add("btn", "btn-success");
    buttonDelete.classList.add("btn", "btn-danger");
    buttonDone.textContent = "Готово";
    buttonDelete.textContent = "Удалить";

    //проверка было ли дело из бд выполнено
    if (todoItem.done) {
      //переключает класс дела
      item.classList.toggle("list-group-item-success");
    }

    item.setAttribute("id", todoItem.id);

    //добавляем обработчик на кнопки
    buttonDone.addEventListener("click", (e) => {
      markTodoAsDone(todoItem);

      item.classList.toggle("list-group-item-success", !todoItem.done);
    });
    buttonDelete.addEventListener("click", (e) => {
      if (confirm("Хотите удалить?")) {
        deleteTodoItem(todoItem);
        item.remove();
      }
    });

    //вкладываем кнопки в div для объединения
    //в buttonGroup аппендим buttonDone, а потом buttonDelete
    buttonGroup.append(buttonDone);
    buttonGroup.append(buttonDelete);
    item.append(buttonGroup);

    return item;
  }

  async function createTodoApp(container, title, owner) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    //перемещаем указатель мыши в форму
    document.getElementById("input").focus();

    //отправляем запрос на список всех дел и response.json() получает массив объектов с делами
    const response = await fetch(
      `http://localhost:3000/api/todos?owner=${owner}`
    );
    const todoItemList = await response.json();

    let methods = {
      markTodoAsDone({ id, done }) {
        const response = fetch(`http://localhost:3000/api/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: !done }),
        });
        // const data = response.json();
        // console.log(data);
      },
      deleteTodoItem({ id }) {
        const response = fetch(`http://localhost:3000/api/todos/${id}`, {
          method: "DELETE",
        });
        if (response.status === 404)
          console.log("Не удалось удалить дело, так как его не существует");
        // const data = response.json();
        // console.log(data);
      },
    };

    //перебираем массив с делами из бд и отправляем дела на отрисовку через функцию
    todoItemList.forEach((todoItem) => {
      const todoItemElement = createTodoItemElement(todoItem, methods);
      todoList.append(todoItemElement);
    });

    //Блокировка кнопки создания элемента если в поле для ввода пусто
    todoItemForm.input.addEventListener("input", function () {
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
        return;
      } else {
        todoItemForm.button.disabled = false;
      }
    });

    //Браузер создает событие Submit на форме по нажатию enter или на кнопку создания дела.
    todoItemForm.form.addEventListener("submit", async (e) => {
      //предотвращаем стандартное действие браузера при отправке формы (перезагрузка страницы)
      e.preventDefault();

      //игнорируем создание элемента если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      //добавляем дело в BD
      const response = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner: owner,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      //response.json() после добавления выводт добавленный объект (дело)
      const todoItem = await response.json();

      const todoItemElement = createTodoItemElement(todoItem, methods);

      //создаем и добавляем в список (ul) новое дело (li) с названием из поля ввода фармы
      todoList.append(todoItemElement);

      //обнуляем значение в поле ввода формы, чтобы пользователь не стирал
      todoItemForm.input.value = "";
      document.getElementById("input").focus();
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
