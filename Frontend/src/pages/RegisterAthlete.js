import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterAthlete() {
  const [form, setForm] = useState({
    name: '',
    anoNascimento: '',
    cidade: '',
    genero: '',
    cpf: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); // <— objeto para erros
  const [errorGeneral, setErrorGeneral] = useState('');
  const navigate = useNavigate();

  // Validar campos localmente
  const validate = () => {
    const errs = {};
    if (form.name.trim() === '') errs.name = 'Nome é obrigatório.';
    if (!/^\d{4}$/.test(form.anoNascimento))
      errs.anoNascimento = 'Informe um ano válido (4 dígitos).';
    if (form.cidade.trim() === '') errs.cidade = 'Cidade é obrigatória.';
    if (!['Masculino', 'Feminino'].includes(form.genero))
      errs.genero = 'Selecione o gênero.';
    if (!/^\d{11}$/.test(form.cpf)) errs.cpf = 'Informe um CPF válido (11 dígitos).';
    if (form.password.length < 6)
      errs.password = 'Senha deve ter pelo menos 6 caracteres.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // limpa erro no campo enquanto digita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    try {
      await axios.post('http://localhost:3001/auth/register', {
        ...form,
        role: 'athlete',
      });
      navigate('/login');
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || 'Erro no registro de atleta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registrar Atleta
        </h2>

        {errorGeneral && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {errorGeneral}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
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

          {/* Ano de Nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ano de Nascimento
            </label>
            <input
              name="anoNascimento"
              placeholder="Ano de Nascimento"
              value={form.anoNascimento}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.anoNascimento
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.anoNascimento && (
              <p className="text-danger text-sm mt-1">
                {errors.anoNascimento}
              </p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.cidade
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.cidade && (
              <p className="text-danger text-sm mt-1">{errors.cidade}</p>
            )}
          </div>

          {/* Gênero */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gênero
            </label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.genero
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            {errors.genero && (
              <p className="text-danger text-sm mt-1">{errors.genero}</p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              name="cpf"
              placeholder="CPF (11 dígitos)"
              maxLength={11}
              value={form.cpf}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.cpf
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.cpf && (
              <p className="text-danger text-sm mt-1">{errors.cpf}</p>
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
              placeholder="Senha (mín. 6 caracteres)"
              value={form.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.password
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.password && (
              <p className="text-danger text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Registrar Atleta
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