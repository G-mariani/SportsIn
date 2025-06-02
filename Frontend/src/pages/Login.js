/* src/pages/Login.js */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const navigate                    = useNavigate();

  // valida CPF ou CNPJ
  const validateId = (id) => {
    if (/^\d{11}$/.test(id)) return 'athlete';    // CPF válido
    if (/^\d{14}$/.test(id)) return 'company';    // CNPJ válido
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const role = validateId(identifier);
    if (!role) {
      setError('Informe um CPF (13 dígitos) ou CNPJ (14 dígitos) válidos.');
      return;
    }
    try {
      // envia o login com { identifier, password, role }
      const res = await axios.post('http://localhost:3001/auth/login', {
        identifier,
        password,
        role
      });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
      navigate(role === 'athlete' ? '/athletes' : '/companies');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>CPF/CNPJ:</label><br/>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Só números"
            required
          />
        </div>
        <div>
          <label>Senha:</label><br/>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem conta? <Link to="/register">Registre-se</Link>
      </p>
    </div>
  );
}
