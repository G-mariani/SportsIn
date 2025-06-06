import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterCompany() {
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    razaoSocial: '',
    cidade: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((errs) => ({ ...errs, [e.target.name]: '' }));
  };

  // validação CNPJ e e-mail
  const validate = () => {
    const errs = {};
    if (!/^\d{14}$/.test(form.cnpj)) {
      errs.cnpj = 'CNPJ deve conter exatamente 14 dígitos numéricos.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'E-mail inválido.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('http://localhost:3001/auth/register', {
        ...form,
        role: 'company',
      });
      navigate('/login');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro no registro da empresa');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registrar Empresa
        </h2>

        {submitError && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.name
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* CNPJ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">CNPJ</label>
            <input
              name="cnpj"
              placeholder="CNPJ (14 dígitos)"
              maxLength={14}
              value={form.cnpj}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.cnpj
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.cnpj && (
              <p className="text-danger text-sm mt-1">{errors.cnpj}</p>
            )}
          </div>

          {/* Razão Social */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Razão Social
            </label>
            <input
              name="razaoSocial"
              placeholder="Razão Social"
              value={form.razaoSocial}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              name="email"
              placeholder="E-mail"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.email
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.email && (
              <p className="text-danger text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              name="password"
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Registrar Empresa
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
