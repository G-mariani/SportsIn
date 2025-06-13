// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import '../Login.css';  // o CSS copiado do template

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  const validateId = (id) => {
    if (/^\d{11}$/.test(id)) return 'athlete';
    if (/^\d{14}$/.test(id)) return 'company';
    return null;
  };

  const handleSubmit = async (e) => {
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
      navigate(role === 'athlete' ? '/athletes' : '/companies');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="login-card animate__animated animate__fadeIn">
              <div className="login-header">
                <img src="/SportsIn sem fundo.png" alt="SportsIn Logo" />
                <h2>Bem-vindo de volta</h2>
                <p>Entre na sua conta para continuar</p>
              </div>

              <div className="login-body">
                {error && (
                  <p className="text-danger text-center mb-3">{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="CPF ou CNPJ"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Senha"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn login-btn animate__animated animate__pulse animate__infinite animate__slower"
                  >
                    Entrar
                  </button>

                  <div className="form-group text-center mt-3">
                    <Link to="#" className="text-primary">
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <div className="login-footer">
                    <p>
                      Não tem uma conta?{' '}
                      <Link to="/register" className="text-primary">
                        Cadastre-se
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* se quiser a onda SVG, adicione aqui */}
    </section>
  );
}
