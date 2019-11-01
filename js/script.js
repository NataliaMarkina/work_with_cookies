let nameCookie = document.getElementById("name");
let valueCookie = document.getElementById("value");
let expiresCookie = document.getElementById("expires");
let myTable = document.getElementById("myTable").getElementsByTagName("TBODY")[0];

let date;
let dateUTC;
let index = 0;
let arrName = [];
let flag = true;

window.onload = loadCookies();

function loadCookies() {
    let cookies = document.cookie.split(";");                          //получаем все имеющиеся cookies и разбиваем их по разделителю ";"

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];                                                //для каждого cookie из массива всех cookies
        let eqPos = cookie.indexOf("=");                                        //находим позицию знака равенства
        let name;
        let value;

        if (eqPos > -1)                                                         //если этот знак найден, то получаем имя текущего cookie
        {
            name = cookie.substr(0, eqPos);
            value = cookie.substr(eqPos + 1, cookie.length);

            addInTable(name, value, "");
        }
    }
}

function addNewCookie() {                                                       //функция, которая при нажатии на кнопку "Добавить новую cookie" открывает форму для ввода данных и кнопку "Добавить"
    document.getElementById("addCookie").style.display = "block";
    document.getElementById("add").style.display = "block";
    document.getElementById("addNewCookie").disabled = true;
}

function addInTable(name, value, expires) {                                      //добавление cookie в таблицу
    flag = arrName.includes(name);                                          //проверка на наличие в таблице cookie с таким же именем
    if (flag == false || arrName.length == 0)                               //если такого имени еще нет или таблица еще пустая
    {
        if (expires != "")                                                  //если переданное количество дней не равно пустой строке, то генерируется дата удаления cookie, путем прибавления к текущей дате введенного количества дней и создается новая cookie
        {
            date = new Date(Date.now() + 86400e3 * expires);
            dateUTC = date.toUTCString();
            document.cookie = nameCookie.value + "=" + valueCookie.value + "; expires=" + dateUTC;
        } else {                                                            //иначе присваиваем дате пустую строку
            date = "";
        }
        
        let newTr = document.createElement("tr");                 //создаем новую строку, добавляем ее в таблицу (id зависит от index)
        newTr.setAttribute("id", "tr" + index);
        myTable.appendChild(newTr);

        let newTd1 = document.createElement("td");                //создаем новую ячейку в только что созданной строке и в первом столбце, добавляем ее в таблицу (id зависит от index)
        newTd1.setAttribute("id", "td1" + index);
        newTr.appendChild(newTd1);

        let newTd2 = document.createElement("td");                //создаем новую ячейку в только что созданной строке и во втором столбце, добавляем ее в таблицу (id зависит от index)
        newTd2.setAttribute("id", "td2" + index);
        newTr.appendChild(newTd2);

        let newTd3 = document.createElement("td");                //создаем новую ячейку в только что созданной строке и в третьем столбце, добавляем ее в таблицу (id зависит от index)
        newTd3.setAttribute("id", "td3" + index);
        newTr.appendChild(newTd3);

        newTd1.innerHTML = name;                                            //заполняем ячейки текстом
        newTd2.innerHTML = value;
        newTd3.innerHTML = date;

        arrName[index] = name;                                          //добавляем имя cookie в массив, содержащий все имеющиеся имена cookies

        let but = document.createElement("button");           //создаем кнопку "Удалить" в только что созданной строке, добавляем ее в таблицу (id зависит от index)
        but.innerHTML = "Удалить";
        but.setAttribute("id", "but" + index);
        but.setAttribute("onclick", "deleteCookie(this.id)");   //при нажатии на эту кнопку вызывается функция deleteCookie (в качестве аргумента передается id нажатой кнопки) 
        but.setAttribute("style", "width: 100%");
        newTr.appendChild(but);

        index++;                                                        //значение index увеличивается на 1
    } else {                                                            //если такое имя уже есть, то находим позицию этого cookie и меняем его значение и дату на новые
        let pos = arrName.indexOf(name);
        date = new Date(Date.now() + 86400e3 * expires);
        dateUTC = date.toUTCString();
        document.cookie = arrName[pos] + "=" + value + "; expires=" + dateUTC;

        let td1 = document.getElementById("td1" + pos);         //меняем значения в таблице
        td1.innerHTML = name;
        let td2 = document.getElementById("td2" + pos);
        td2.innerHTML = value;
        let td3 = document.getElementById("td3" + pos);
        td3.innerHTML = date;
    }
}

function add() {                                                                                       //добавление cookie
    if (nameCookie.value == "" || valueCookie.value == "" || expiresCookie.value == "")                //если хотя бы одно из полей не заполнено, то выводится сообщение об ошибке 
    {
        alert("Заполните все поля формы!");
    } else if (isNaN(parseInt(expiresCookie.value))) {                                                 //если в поле "Срок действия" введено не числовое значение, то выводится сообщение об ошибке
        alert("Поле Срок действия заполненно не корректно!");
    } else {                                                                                            //если все поля заполненны корректно, то вызывается функция добавления cookie в таблицу
        addInTable(nameCookie.value, valueCookie.value, expiresCookie.value);                                
    }
    
    document.getElementById("addCookie").style.display = "none";                              //после добавления сookie скрываем форму и кнопку "Добавить"
    document.getElementById("add").style.display = "none";
    document.getElementById("addNewCookie").disabled = false;
    nameCookie.value = "";                                                                              //очищаем все поля формы
    valueCookie.value = "";
    expiresCookie.value = "";
}

function deleteCookie(butId) {                                         //удаление cookie по идентификатру нажатой кнопки "Удалить"
    let pos = parseInt(butId.replace('but', ''));                      //получаем позицию элемента, который нужно удалить
    
    date = new Date(Date.now() - 1);                            //создаем дату, которая уже в прошлом
    dateUTC = date.toUTCString();
    document.cookie = arrName[pos] + "=; expires=" + dateUTC;          //изменяем дату cookie, который хотим удалить, на только что созданную
    
    delete arrName[pos];                                               //удаляем имя этого cookie из массива, содержащего все имеющиеся имена cookies
    
    let trDelet = document.getElementById("tr" + pos);       //удаляем строку с этим cookie из таблицы
    myTable.removeChild(trDelet);
}

function deleteAllCookies() {                                                   //удаление всех cookies
    let cookies = document.cookie.split(";");                          //получаем все имеющиеся cookies и разбиваем их по разделителю ";"

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];                                                //для каждого cookie из массива всех cookies
        let eqPos = cookie.indexOf("=");                                        //находим позицию знака равенства
        let name;
        
        if (eqPos > -1)                                                         //если этот знак найден, то получаем имя текущего cookie
        {
            name = cookie.substr(0, eqPos);
        }
        
        date = new Date(Date.now() - 1);                                 //создаем дату, которая уже в прошлом
        dateUTC = date.toUTCString();        
        document.cookie = name + "=; expires=" + dateUTC;                       //изменяем дату cookie с указанным именем на только что созданную
    }
    
    for (let i = 0; i < index; i++) {                                           //удаляем все строки из таблицы, которые были созданы
        if (document.getElementById("tr" + i) != null) {              //проверяем наличие строки для того, чтобы не возникало проблем с попыткой удаления строк, которые уже были удалены ранее при нажатии на кнопку "Удалить" в таблице
            myTable.removeChild(document.getElementById("tr" + i));
        }
    }
    
    alert("Все cookie удалены!");
}

function show() {
    alert(document.cookie);
}