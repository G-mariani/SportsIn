import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // 'athlete' ou 'company'
  const athleteId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    // 1) Carrega detalhes da oportunidade
    axios
      .get(`http://localhost:3001/api/opportunities/${id}`)
      .then((res) => setOpportunity(res.data))
      .catch(() => setError('Erro ao carregar a oportunidade.'));

    // 2) Se for atleta, verificar se já se candidatou
    if (role === 'athlete') {
      axios
        .get('http://localhost:3001/api/applications')
        .then((res) => {
          const userApps = res.data
            .filter((app) => app.athlete_id === athleteId)
            .map((app) => app.opportunity_id);
          if (userApps.includes(Number(id))) {
            setAlreadyApplied(true);
          }
        })
        .catch(() => {
          // Se falhar, o botão permanecerá habilitado
        });
    }
  }, [id, role, athleteId]);

  const handleApply = async () => {
    setApplyError('');
    setApplySuccess('');

    try {
      await axios.post('http://localhost:3001/api/applications', {
        athlete_id: athleteId,
        opportunity_id: Number(id),
      });
      setApplySuccess('Candidatura enviada com sucesso!');
      setAlreadyApplied(true);
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Erro ao candidatar-se.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">{opportunity.title}</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-medium">Descrição:</p>
            <p>{opportunity.description}</p>
          </div>
          <div>
            <p className="font-medium">Requisitos:</p>
            <p>{opportunity.requirements}</p>
          </div>
          <div>
            <p className="font-medium">Prazo:</p>
            <p>{new Date(opportunity.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        {role === 'athlete' && (
          <div className="mt-6 space-y-2">
            {applyError && (
              <p className="bg-red-100 text-red-700 px-3 py-2 rounded">
                {applyError}
              </p>
            )}
            {applySuccess && (
              <p className="bg-green-100 text-green-700 px-3 py-2 rounded">
                {applySuccess}
              </p>
            )}
            <button
              onClick={handleApply}
              disabled={alreadyApplied}
              className={`w-full ${
                alreadyApplied
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-secondary'
              } py-2 rounded-md transition`}
            >
              {alreadyApplied ? 'Já Candidatado' : 'Candidatar-se'}
            </button>
          </div>
        )}

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
