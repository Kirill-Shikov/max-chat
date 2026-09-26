# MAX Chat — тестовое задание на позицию Frontend React Developer


## 🚀 Стек технологий

- **React 19** (Hooks: `useState`, `useEffect`, `useRef`)
- **Vite** — сборка и dev-сервер
- **Axios** — HTTP-запросы к GREEN-API
- **CSS Modules** — изолированная стилизация

## 📋 Функционал

- ✅ Авторизация по `idInstance` и `apiTokenInstance`
- ✅ Создание нового чата по номеру телефона / `chatId`
- ✅ Отправка текстовых сообщений
- ✅ Получение входящих сообщений через Long Polling (`receiveNotification` + `deleteNotification`)
- ✅ Автопрокрутка к новому сообщению (с учётом позиции скролла)
- ✅ Индикация статуса отправки

## ⚙️ Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Kirill-Shikov/max-chat.git
cd max-chat

. Установить зависимости
npm install

Запустить dev-сервер
npm run dev
