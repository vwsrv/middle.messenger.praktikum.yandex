# 💬 SPA Messenger

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars.js-f0772b?style=flat-square&logo=handlebarsdotjs&logoColor=black)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=flat-square&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=flat-square&logo=chai&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=flat-square&logo=netlify&logoColor=#00C7B7)

Веб-приложение чат-мессенджера с авторизацией, списком чатов и настройками профиля. Проект построен на собственной архитектуре компонентов с использованием TypeScript, Handlebars для шаблонизации и включает полное покрытие тестами.

## 🎯 Функциональность

### 🔐 Авторизация
- Регистрация и вход пользователей
- Валидация форм в реальном времени
- Безопасная аутентификация через API

### 💬 Чат
- Создание и управление чатами
- Отправка и получение сообщений в реальном времени
- Поиск пользователей для добавления в чат
- Удаление пользователей из чата
- WebSocket соединение для мгновенных сообщений

### 👤 Профиль
- Редактирование личных данных
- Смена пароля
- Загрузка и изменение аватара
- Настройки профиля

### 🎨 UI/UX
- Адаптивный дизайн
- Современный интерфейс
- Анимации и переходы
- Модальные окна
- Уведомления об ошибках

## API Дока

https://ya-praktikum.tech/api/v2/swagger/#/

## 🎨 Прототипы

Figma https://clck.ru/3M9EgD

## [![Netlify Status](https://api.netlify.com/api/v1/badges/a5d0a67f-4258-48f2-b1fe-f2e80cf43b13/deploy-status)](https://app.netlify.com/projects/middlemessengr/deploys) Демо

https://middlemessengr.netlify.app/

## 🛠 Технологический стек

| Технология                                                                                                              | Назначение                    |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)         | Типизация и разработка        |
| ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)                    | Сборка проекта               |
| ![Handlebars](https://img.shields.io/badge/Handlebars.js-f0772b?style=flat-square&logo=handlebarsdotjs&logoColor=black) | Шаблонизация                 |
| ![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=flat-square&logo=mocha&logoColor=white)                        | Тестирование                 |
| ![Chai](https://img.shields.io/badge/Chai-A30701?style=flat-square&logo=chai&logoColor=white)                           | Assertion библиотека         |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)                     | Линтинг кода                 |
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)               | Форматирование кода          |
| ![Husky](https://img.shields.io/badge/Husky-000000?style=flat-square&logo=husky&logoColor=white)                       | Git hooks                    |
| ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=flat-square&logo=netlify&logoColor=#00C7B7)         | Деплой                       |

## 🏗 Архитектура

```
src/
├── app/                    # Основное приложение
│   ├── providers/         # Провайдеры (роутер, авторизация)
│   ├── resources/         # Ресурсы (store, интерфейсы)
│   └── styles/           # Глобальные стили
├── entities/              # Бизнес-сущности
│   ├── chat/             # Логика чатов
│   ├── message/          # Логика сообщений
│   └── user/             # Логика пользователей
├── features/             # Функциональные модули
│   ├── auth/             # Авторизация
│   ├── chats/            # Чат-интерфейс
│   └── profile/          # Профиль пользователя
├── pages/                # Страницы приложения
├── shared/               # Общие компоненты и утилиты
│   ├── lib/              # Библиотеки (API, роутер, компоненты)
│   └── ui/               # UI компоненты
```

## 🚀 Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-username/your-repo.git

# 2. Установить зависимости
npm install

# 3. Запустить dev-сервер (порт 3000)
npm run start

# 4. Собрать production
npm run build
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в режиме watch
npm run test:watch
```

### Покрытие тестами

- **Компоненты** - тестирование базового класса Block
- **Роутер** - тестирование навигации и маршрутизации
- **API** - тестирование HTTP запросов и обработки ответов
- **Шаблонизатор** - тестирование Handlebars регистрации и компиляции

## 🔧 Разработка

```bash
# Линтинг
npm run lint
npm run lint:fix

# Форматирование
npm run format

# Стили
npm run stylelint
npm run stylelint:fix
```

## 📦 Сборка

```bash
# Development сборка
npm run start

# Production сборка
npm run build

# Предварительный просмотр production
npm run preview
```
