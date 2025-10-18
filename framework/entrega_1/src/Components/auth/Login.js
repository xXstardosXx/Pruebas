import React, { useState } from 'react';
import '../../styles/Login.css';

export default function Login({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetMessages = () => { setError(''); setSuccess(''); };

  const handleChange = (e) => { setCredentials({ ...credentials, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMessages();
    if (isRegistering) {
      const res = onRegister ? onRegister(credentials) : { success: false, message: 'No hay función de registro' };
      if (res && res.success) {
        setSuccess('Registro correcto. Has iniciado sesión.');
      } else {
        setError((res && res.message) || 'Error al registrar');
      }
    } else {
      const ok = onLogin ? onLogin(credentials) : false;
      if (!ok) setError('Credenciales incorrectas. Usuario: admin / Contraseña: password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Registrar' : 'Iniciar Sesión'}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isRegistering && (
          <div className="form-group">
            <label>Email:</label>
            <input name="email" type="email" value={credentials.email} onChange={handleChange} required />
          </div>
        )}

        <div className="form-group">
          <label>Usuario:</label>
          <input name="username" type="text" value={credentials.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
        </div>

        <button type="submit">{isRegistering ? 'Registrar' : 'Ingresar'}</button>

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={() => { resetMessages(); setIsRegistering(!isRegistering); }}>
            {isRegistering ? 'Volver a Iniciar Sesión' : 'Crear una Cuenta'}
          </button>
        </div>

        {!isRegistering && (
          <div className="login-hint">
            <p>Usuario: admin</p>
            <p>Contraseña: password</p>
          </div>
        )}
      </form>
    </div>
  );
}
