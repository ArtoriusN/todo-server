//Проверка на наличие значений по умолчанию (в obj) и запуск функции добавления если такие есть
if (Object.keys(obj).length == 0) {
} else {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      var todoItem = createTodoItem(obj[key]);
      addItemToDom(todoItem);
    } else if (obj[key] === true) {
      todoItem.item.classList.toggle("list-group-item-success");
    }
  }
}
//функция меняющая состояние done на противоположное
function changeItemDone(arr, id) {
  id = parseInt(id);
  arr.map((obj) => {
    if (obj.id === id) {
      obj.done = !obj.done;
    }
  });
}
//функция удаляющая дело
function deleteItem(arr, id) {
  arr.forEach(function (item, i, arr) {
    if (item.id === +id) {
      arr.splice(i, 1);
    }
  });
}
//Функция добавления и удаления дел которая вызывается при наличии значений по умолчанию или ручном вводе
function addItemToDom(todoItem) {
  todoList.append(todoItem.item);
  //окрашиваем в зеленый если отмечен или наоборот убираем окраску через toggle
  todoItem.buttonDone.addEventListener("click", function () {
    let idInput = todoItem.item.getAttribute("id");
    let returnArray1 = JSON.parse(localStorage.getItem(title));
    todoItem.item.classList.toggle("list-group-item-success");
    changeItemDone(returnArray1, idInput);
    localStorage.setItem(title, JSON.stringify(returnArray1));
  });
  //запрос на удаление и удаление элемента
  todoItem.buttonDelete.addEventListener("click", function () {
    returnArray1 = JSON.parse(localStorage.getItem(title));
    idInput = todoItem.item.getAttribute("id");
    if (confirm("Хотите удалить?")) {
      todoItem.item.remove();
      deleteItem(returnArray1, idInput);
      localStorage.setItem(title, JSON.stringify(returnArray1));
    }
  });
}

//Блокировка кнопки создания элемента если в поле для ввода пусто
todoItemForm.input.addEventListener("input", function () {
  if (!todoItemForm.input.value) {
    todoItemForm.button.disabled = true;
    return;
  } else {
    todoItemForm.button.disabled = false;
  }
});
let objLocal = {};
var arrayItems = [];
var returnArray = JSON.parse(localStorage.getItem(title));
//присваеваем массив из localStorage в массив с которым будем работать
arrayItems = returnArray || [];

//добавляем данные из локалсторедж в app
//перебор массива с обектами через forEach
if (!!arrayItems) {
  arrayItems.forEach(function (item) {
    var todoItem = createTodoItem(item.name, item.id);
    addItemToDom(todoItem);
    if (item.done === true) {
      //переключает класс дела
      todoItem.item.classList.toggle("list-group-item-success");
    }
  });
}

objLocal = {
  name: todoItemForm.input.value,
  id: todoItem.idItem,
  done: false,
};

deleteItem(returnArray1, idInput);
localStorage.setItem(title, JSON.stringify(returnArray1));
