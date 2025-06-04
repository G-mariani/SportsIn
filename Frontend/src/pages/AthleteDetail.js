import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function AthleteDetail() {
  const { id } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/athletes/${id}`)
      .then(res => setAthlete(res.data))
      .catch(err => setError('Erro ao carregar detalhes.'));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Detalhes do Atleta</h2>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-40">Nome:</span>
            <span>{athlete.name}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Ano Nascimento:</span>
            <span>{athlete.anoNascimento}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Gênero:</span>
            <span>{athlete.genero}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">Cidade:</span>
            <span>{athlete.cidade}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-40">CPF:</span>
            <span>{athlete.cpf}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            to={`/athletes/edit/${athlete.id}`}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
          >
            Editar
          </Link>
          <button
            onClick={() => navigate('/athletes')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
