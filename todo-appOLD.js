(function () {
    let idTodo = 0;
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h1');
        appTitle.className = "header";
        appTitle.innerHTML = title;
        return appTitle;
    }
    //создаем и возвращаем форму для создания дела форма инпут див баттон
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.setAttribute('id', 'input');
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
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
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }
    //создаем и возвращаем дело
    function createTodoItem(name, id) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let buttonDone = document.createElement('button');
        let buttonDelete = document.createElement('button');

        //Помещаем передаваемое название в элемент списка
        item.textContent = name;
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        let idItem = Date.now();
        if (!id) {
            id = idItem;
        }
        item.setAttribute('id', id);
        
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        buttonDone.classList.add('btn', 'btn-success');
        buttonDelete.classList.add('btn', 'btn-danger');
        buttonDone.textContent = 'Готово';
        buttonDelete.textContent = 'Удалить';

        //вкладываем кнопки в div для объединения
        buttonGroup.append(buttonDone);
        buttonGroup.append(buttonDelete);
        item.append(buttonGroup);

        return {
            item,
            idItem,
            buttonDone,
            buttonDelete,
        }
    }

    function createTodoApp(container, title = 'Список дел', obj = {}) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        //перемещаем указатель мыши в форму
        document.getElementById("input").focus();
        container.append(todoList);

        //Проверка на наличие значений по умолчанию (в obj) и запуск функции добавления если такие есть
        if (Object.keys(obj).length == 0) {
        } else {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    var todoItem = createTodoItem(obj[key]);
                    addItemToDom(todoItem);
                } else if (obj[key] === true) {
                    todoItem.item.classList.toggle('list-group-item-success');
                }
            }
        }
        //функция меняющая состояние done на противоположное
        function changeItemDone(arr, id) {
            id = parseInt(id);
            arr.map(obj => {
                if (obj.id === id) {
                    obj.done = !obj.done;
                }
            });
        }
        //функция удаляющая дело
        function deleteItem(arr, id) {
            arr.forEach(function(item, i, arr) {
                if (item.id === +id) {
                    arr.splice(i, 1);
                }
            });
        }
        //Функция добавления и удаления дел которая вызывается при наличии значений по умолчанию или ручном вводе
        function addItemToDom(todoItem) {
            todoList.append(todoItem.item);
                    //окрашиваем в зеленый если отмечен или наоборот убираем окраску через toggle
                    todoItem.buttonDone.addEventListener("click", function (){
                        let idInput = todoItem.item.getAttribute('id');
                        let returnArray1 = JSON.parse(localStorage.getItem(title));
                        todoItem.item.classList.toggle('list-group-item-success');
                        changeItemDone(returnArray1, idInput);
                        localStorage.setItem(title, JSON.stringify(returnArray1));
                    });
                    //запрос на удаление и удаление элемента
                    todoItem.buttonDelete.addEventListener("click", function (){
                        returnArray1 = JSON.parse(localStorage.getItem(title));
                        idInput = todoItem.item.getAttribute('id');
                        if (confirm('Хотите удалить?')) {
                            todoItem.item.remove();
                            deleteItem(returnArray1, idInput);
                            localStorage.setItem(title, JSON.stringify(returnArray1));
                        }
                    });
        }

        //Блокировка кнопки создания элемента если в поле для ввода пусто
        todoItemForm.input.addEventListener('input', function () {
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
            arrayItems.forEach(function(item) {
                var todoItem = createTodoItem(item.name, item.id);
                addItemToDom(todoItem);
                if (item.done === true) {
                    //переключает класс дела
                    todoItem.item.classList.toggle('list-group-item-success');
                }
            });
        }

        //определяем id списка кнопки
        todoItemForm.form.addEventListener('submit', function (e) {
            //предотвращаем стандартное действие браузера при отправке формы (перезагрузка страницы)
            e.preventDefault();

            //игнорируем создание элемента если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value || todoItemForm.input.value.trim() === '') {
                todoItemForm.input.value = '';
                return;
            }
            let todoItem = createTodoItem(todoItemForm.input.value);
            objLocal = {
                name: todoItemForm.input.value,
                id: todoItem.idItem,
                done: false,
            }
            returnArray = JSON.parse(localStorage.getItem(title));
            arrayItems = returnArray || [];
            arrayItems.push(objLocal);
            localStorage.setItem(title, JSON.stringify(arrayItems));
            addItemToDom(todoItem);
            //создаем и добавляем в список (ul) новое дело (li) с названием из поля ввода фармы
            // todoList.append(createTodoItem(todoItemForm.input.value).item);

            //обнуляем значение в поле ввода формы, чтобы пользователь не стирал
            todoItemForm.input.value = '';
            document.getElementById("input").focus();
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;
})();