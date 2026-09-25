import axios from 'axios';

const API_URL = 'https://api.green-api.com';

export const greenApi = {
  // Проверка авторизации
  getSettings: async (idInstance, apiTokenInstance) => {
    const url = `${API_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
    const response = await axios.get(url);
    return response.data;
  },

  // Отправка сообщения
  sendMessage: async (idInstance, apiTokenInstance, chatId, message) => {
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const body = {
      chatId: chatId,
      message: message,
    };
    const response = await axios.post(url, body);
    return response.data;
  },

  // Получение уведомлений
  receiveNotification: async (idInstance, apiTokenInstance) => {
    const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
    // receiveTimeout — от 5 до 60 секунд, по умолчанию 5
    const response = await axios.get(url, { 
      timeout: 25000, // чуть больше receiveTimeout, чтобы не рвать запрос раньше времени
      params: { receiveTimeout: 20 }
    }); 
    return response.data; 
  },

  // Удаление уведомления
  deleteNotification: async (idInstance, apiTokenInstance, receiptId) => {
    const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    const response = await axios.delete(url);
    return response.data;
  }
};