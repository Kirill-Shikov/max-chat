import { useState, useEffect, useRef } from 'react';
import { greenApi } from '../api/greenApi';
import styles from './Chat.module.css';

const Chat = ({ credentials, onLogout }) => {
  const { idInstance, apiTokenInstance } = credentials;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const pollingTimer = useRef(null);
  const isCancelled = useRef(false);
  const messagesAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- Формирование chatId ---
  const handleStartChat = () => {
    if (!phoneNumber.trim()) return;
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (!cleanNumber) {
      alert('Введите корректный номер или ID');
      return;
    }
    setChatId(`${cleanNumber}@c.us`);
    setMessages([]);
  };

  // --- Отправка сообщения ---
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || isSending) return;

    setIsSending(true);
    try {
      const response = await greenApi.sendMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        newMessage
      );

      setMessages((prev) => [
        ...prev,
        { id: response.idMessage, text: newMessage, isMy: true },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось отправить сообщение. Проверь консоль.');
    } finally {
      setIsSending(false);
    }
  };

  // --- Long Polling через рекурсивный setTimeout ---
  useEffect(() => {
    if (!chatId) return;
    isCancelled.current = false;

    const poll = async () => {
      if (isCancelled.current) return;
      try {
        const notification = await greenApi.receiveNotification(
          idInstance,
          apiTokenInstance
        );

        if (notification && notification.body) {
          const { receiptId, body } = notification;

          if (body.typeWebhook === 'incomingMessageReceived') {
            const text = body.messageData?.textMessageData?.textMessage;
            const senderId = body.senderData?.chatId;

            // Фильтр: сообщение относится к текущему открытому чату
            if (text && senderId === chatId) {
              setMessages((prev) => [
                ...prev,
                { id: body.idMessage, text, isMy: false },
              ]);
            }
          }

          await greenApi.deleteNotification(
            idInstance,
            apiTokenInstance,
            receiptId
          );
        }
      } catch (error) {
        if (error.code !== 'ECONNABORTED') {
          console.error('Polling error:', error);
        }
      }

      if (!isCancelled.current) {
        pollingTimer.current = setTimeout(poll, 1000);
      }
    };

    poll();

    return () => {
      isCancelled.current = true;
      if (pollingTimer.current) clearTimeout(pollingTimer.current);
    };
  }, [idInstance, apiTokenInstance, chatId]);

  // --- Умная автопрокрутка вниз при новом сообщении ---
  useEffect(() => {
    const container = messagesAreaRef.current;
    if (!container) return;

    // Проверяем, находится ли пользователь внизу (в пределах 100px от низа)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // --- UI ---
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>GREEN-API Чат (MAX)</span>
        <button className={styles.logoutButton} onClick={onLogout}>
          Выйти
        </button>
      </div>

      {!chatId ? (
        <div className={styles.startChatRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="Номер телефона или chatId"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartChat()}
          />
          <button className={styles.sendButton} onClick={handleStartChat}>
            Начать чат
          </button>
        </div>
      ) : (
        <>
          <div className={styles.messagesArea} ref={messagesAreaRef}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                Сообщений пока нет. Напиши первым!
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.isMy ? styles.messageRowMy : styles.messageRowOther
                }`}
              >
                <div
                  className={`${styles.messageBubble} ${
                    msg.isMy ? styles.messageBubbleMy : styles.messageBubbleOther
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Якорь для автопрокрутки */}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isSending}
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? '...' : 'Отправить'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;