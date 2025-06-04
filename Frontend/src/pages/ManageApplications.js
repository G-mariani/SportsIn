/* src/pages/ManageApplications.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageApplications() {
  const [appsWithInfo, setAppsWithInfo] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const companyId = localStorage.getItem('userId');
    // 1) Buscar oportunidades da empresa
    axios
      .get('http://localhost:3001/api/opportunities')
      .then(async (opRes) => {
        const myOps = opRes.data.filter(
          (op) => op.company_id.toString() === companyId
        );
        const myOpIds = myOps.map((op) => op.id);

        // 2) Buscar todas as candidaturas
        const appRes = await axios.get('http://localhost:3001/api/applications');
        const relevantApps = appRes.data.filter((app) =>
          myOpIds.includes(app.opportunity_id)
        );

        // 3) Para cada candidatura, buscar dados do atleta e da oportunidade
        const detailed = await Promise.all(
          relevantApps.map(async (app) => {
            try {
              const [athleteRes, opDetailRes] = await Promise.all([
                axios.get(`http://localhost:3001/api/athletes/${app.athlete_id}`),
                axios.get(`http://localhost:3001/api/opportunities/${app.opportunity_id}`),
              ]);
              return {
                id: app.id,
                athleteName: athleteRes.data.name,
                opportunityTitle: opDetailRes.data.title,
                appliedAt: app.applied_at || null, // se existir
              };
            } catch {
              return {
                id: app.id,
                athleteName: 'Atleta não disponível',
                opportunityTitle: 'Oportunidade não disponível',
                appliedAt: null,
              };
            }
          })
        );

        setAppsWithInfo(detailed);
      })
      .catch(() => setError('Erro ao carregar candidaturas.'));
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
        <p className="text-gray-600">Nenhuma candidatura encontrada para suas vagas.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Candidaturas às Suas Oportunidades
        </h2>
        <div className="space-y-4">
          {appsWithInfo.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{app.athleteName}</p>
                <p className="text-sm text-gray-500">{app.opportunityTitle}</p>
                {app.appliedAt && (
                  <p className="text-xs text-gray-400">
                    Data: {new Date(app.appliedAt).toLocaleDateString()}
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
