import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function CompanyForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    razaoSocial: '',
    cidade: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/companies/${id}`)
        .then(res => setForm(res.data))
        .catch(err => setSubmitError('Erro ao carregar dados da empresa.'));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(errs => ({ ...errs, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{14}$/.test(form.cnpj)) {
      errs.cnpj = 'CNPJ deve conter exatamente 14 dígitos numéricos.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'E-mail inválido.';
    }
    if (form.name.trim() === '') errs.name = 'Nome é obrigatório.';
    if (form.razaoSocial.trim() === '') errs.razaoSocial = 'Razão Social é obrigatória.';
    if (form.cidade.trim() === '') errs.cidade = 'Cidade é obrigatória.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/companies/${id}`, form);
      } else {
        // No caso de criar, precisa do user_id: buscado de localStorage ou contexto
        const userId = localStorage.getItem('userId');
        await axios.post('http://localhost:3001/api/companies', {
          user_id: userId,
          ...form,
        });
      }
      navigate('/companies');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro ao salvar empresa.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {id ? 'Editar Empresa' : 'Nova Empresa'}
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.razaoSocial
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.razaoSocial && (
              <p className="text-danger text-sm mt-1">{errors.razaoSocial}</p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
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

          {/* Botão de Submit */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
            >
              {id ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
            </button>
          </div>
        </form>

        <button
          onClick={() => navigate('/companies')}
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
