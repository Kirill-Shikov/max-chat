import { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idInstance && apiTokenInstance) {
      onLogin({ idInstance, apiTokenInstance });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вход в GREEN-API</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="idInstance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;