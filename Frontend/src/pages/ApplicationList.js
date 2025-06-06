import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ApplicationList() {
  const [appsWithInfo, setAppsWithInfo] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const athleteId = localStorage.getItem('userId');
    axios
      .get('http://localhost:3001/api/applications')
      .then(async (res) => {
        // Filtra candidaturas do atleta logado
        const myApps = res.data.filter(
          (app) => app.athlete_id.toString() === athleteId
        );
        // Para cada candidatura, busca o título e deadline da oportunidade
        const detailed = await Promise.all(
          myApps.map(async (app) => {
            try {
              const opRes = await axios.get(
                `http://localhost:3001/api/opportunities/${app.opportunity_id}`
              );
              return {
                id: app.id,
                opportunityId: app.opportunity_id,
                opportunityTitle: opRes.data.title,
                deadline: opRes.data.deadline,
              };
            } catch {
              return {
                id: app.id,
                opportunityId: app.opportunity_id,
                opportunityTitle: 'Título não disponível',
                deadline: null,
              };
            }
          })
        );
        setAppsWithInfo(detailed);
      })
      .catch(() => setError('Erro ao carregar suas candidaturas.'));
  }, []);

  const handleUnapply = (applicationId) => {
    if (!window.confirm('Deseja realmente desfazer esta candidatura?')) return;
    axios
      .delete(`http://localhost:3001/api/applications/${applicationId}`)
      .then(() => {
        // Remove a candidatura da lista local
        setAppsWithInfo((prev) =>
          prev.filter((a) => a.id !== applicationId)
        );
      })
      .catch(() => alert('Erro ao desfazer candidatura'));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (appsWithInfo.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Você ainda não se candidatou a nenhuma vaga.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Minhas Candidaturas</h2>
        <div className="space-y-4">
          {appsWithInfo.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{app.opportunityTitle}</p>
                {app.deadline && (
                  <p className="text-sm text-gray-500">
                    Prazo: {new Date(app.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/opportunities/${app.opportunityId}`}
                  className="text-blue-600 hover:underline"
                >
                  Detalhes
                </Link>
                <button
                  onClick={() => handleUnapply(app.id)}
                  className="text-red-600 hover:underline"
                >
                  Desfazer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
