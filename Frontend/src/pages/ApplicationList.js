/* src/pages/ApplicationList.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

        // Para cada candidatura, busca o título da oportunidade
        const detailed = await Promise.all(
          myApps.map(async (app) => {
            try {
              const opRes = await axios.get(
                `http://localhost:3001/api/opportunities/${app.opportunity_id}`
              );
              return {
                id: app.id,
                opportunityTitle: opRes.data.title,
                deadline: opRes.data.deadline,
              };
            } catch {
              return {
                id: app.id,
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
              <p className="text-sm text-gray-600">ID: {app.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
