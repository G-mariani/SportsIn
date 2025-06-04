import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function AthleteForm() {
  const { id } = useParams(); // se id existir, estamos editando; caso contrário, criando
  const [form, setForm] = useState({
    name: '',
    anoNascimento: '',
    genero: '',
    cidade: '',
    cpf: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  // Busca dados do atleta para edição
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/athletes/${id}`)
        .then(res => setForm(res.data))
        .catch(err => setSubmitError('Erro ao carregar dados do atleta.'));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(errs => ({ ...errs, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (form.name.trim() === '') errs.name = 'Nome é obrigatório.';
    if (!/^\d{4}$/.test(form.anoNascimento))
      errs.anoNascimento = 'Informe um ano válido (4 dígitos).';
    if (!['Masculino', 'Feminino'].includes(form.genero))
      errs.genero = 'Selecione o gênero.';
    if (form.cidade.trim() === '') errs.cidade = 'Cidade é obrigatória.';
    if (!/^\d{13}$/.test(form.cpf)) errs.cpf = 'Informe um CPF válido (13 dígitos).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/athletes/${id}`, form);
      } else {
        // Para criar, assume-se que o user_id já foi gerado durante o registro de usuário
        // Ou, se preferir, user_id pode vir do localStorage ou outro contexto
        const userId = localStorage.getItem('userId');
        await axios.post('http://localhost:3001/api/athletes', {
          user_id: userId,
          ...form,
        });
      }
      navigate('/athletes');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro ao salvar atleta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {id ? 'Editar Atleta' : 'Novo Atleta'}
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

          {/* Gênero */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gênero</label>
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

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              name="cpf"
              placeholder="CPF (13 dígitos)"
              maxLength={13}
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

          {/* Botão de Submit */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
            >
              {id ? 'Atualizar Atleta' : 'Cadastrar Atleta'}
            </button>
          </div>
        </form>

        <button
          onClick={() => navigate('/athletes')}
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
