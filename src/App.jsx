import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [credentials, setCredentials] = useState(null);

  const handleLogin = (creds) => {
    setCredentials(creds);
  };

  const handleLogout = () => {
    setCredentials(null);
  };

  return (
    <div className="App">
      {!credentials ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat credentials={credentials} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;