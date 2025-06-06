import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const navigate                    = useNavigate();

  const validateId = (id) => {
    if (/^\d{11}$/.test(id)) return 'athlete';
    if (/^\d{14}$/.test(id)) return 'company';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const role = validateId(identifier);
    if (!role) {
      setError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válidos.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
        identifier, password, role
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;

      // Redireciona conforme role
      if (res.data.role === 'athlete') {
        navigate('/athletes');
      } else {
        navigate('/companies');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Somente números"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
