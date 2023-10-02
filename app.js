// імпортуємо модулі
const mysql2 = require('mysql2');
const express = require('express');
const path = require('path');

// Створюємо з'єднання з базою даних
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123.',
    database: 'Commercial_veterinary_hospital'
});

// Підключення до бази даних
connection.connect((err) => {
    if (err) {
      console.error('Помилка підключення до бази даних: ' + err.stack);
      return;
    }
  
    console.log('Успішне підключення до бази даних');
});

// Створюємо екземпляр сервера
const app = express();

// Встановлюємо шаблонізатор ejs
app.set('view engine', 'ejs');

// Створюємо змінні для простішого відображення данних за допомогою шаблонізатору
let register, doctors, tariffs;

// Створюємо адаптивний шлях до файлів проекту
const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);
  
// Створюємо запити до бази даних
const query1 = 'SELECT r_num, r_surname_owner, r_breed, r_date FROM register';
const query2 = 'SELECT d_num, d_surname, d_class FROM doctors';
const query3 = 'select t_num, t_name_disease, t_stage, t_cost FROM tariffs';

// Створюємо маршрут для отримання даних з бази даних
app.get('/', async (req, res) => {
    try {
        const [results1, results2, results3] = await Promise.all([
            connection.promise().query(query1),
            connection.promise().query(query2),
            connection.promise().query(query3)
          ]);
          register = results1[0];
          doctors = results2[0];
          tariffs = results3[0]
          // Передаємо сторінку та дані
          res.render(createPath('index'), {register, doctors, tariffs});
    } catch {
        console.error(error);
        res.status(500).send('Internal server error');
    };
});

const PORT = 3000;

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});