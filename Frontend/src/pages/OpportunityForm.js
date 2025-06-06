import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function OpportunityForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const companyId = localStorage.getItem('userId');

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/opportunities/${id}`)
        .then((res) => setForm({
          title: res.data.title,
          description: res.data.description,
          requirements: res.data.requirements,
          deadline: res.data.deadline.slice(0, 10), // formato YYYY-MM-DD
        }))
        .catch(() => setSubmitError('Erro ao carregar dados da oportunidade.'));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((errs) => ({ ...errs, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (form.title.trim() === '') errs.title = 'Título é obrigatório.';
    if (form.description.trim() === '') errs.description = 'Descrição é obrigatória.';
    if (form.requirements.trim() === '') errs.requirements = 'Requisitos são obrigatórios.';
    if (!form.deadline) errs.deadline = 'Prazo é obrigatório.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/opportunities/${id}`, form);
      } else {
        await axios.post('http://localhost:3001/api/opportunities', {
          company_id: companyId,
          ...form,
        });
      }
      navigate('/opportunities');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro ao salvar oportunidade.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {id ? 'Editar Oportunidade' : 'Nova Oportunidade'}
        </h2>

        {submitError && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              name="title"
              placeholder="Título da Oportunidade"
              value={form.title}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.title
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.title && (
              <p className="text-danger text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              name="description"
              placeholder="Descreva a oportunidade"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.description
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.description && (
              <p className="text-danger text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Requisitos
            </label>
            <textarea
              name="requirements"
              placeholder="Quais requisitos?"
              value={form.requirements}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.requirements
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.requirements && (
              <p className="text-danger text-sm mt-1">{errors.requirements}</p>
            )}
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Prazo</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none ${
                errors.deadline
                  ? 'border-danger focus:ring-danger'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.deadline && (
              <p className="text-danger text-sm mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* Botão de Submit */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
            >
              {id ? 'Atualizar Oportunidade' : 'Criar Oportunidade'}
            </button>
          </div>
        </form>

        <button
          onClick={() => navigate('/opportunities')}
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
