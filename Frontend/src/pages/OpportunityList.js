import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function OpportunityList() {
  const [opps, setOpps] = useState([]);
  const [error, setError] = useState('');
  const [myApps, setMyApps] = useState([]); // lista de opportunity_id que o atleta já se candidatou

  const role = localStorage.getItem('role');       // "athlete" | "company" | "admin"
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    // 1) Buscamos as oportunidades (backend já faz o filtro fino para companies)
    axios
      .get('http://localhost:3001/api/opportunities')
      .then((res) => setOpps(res.data))
      .catch(() => setError('Erro ao buscar oportunidades'));

    // 2) Se for atleta, pegamos as candidaturas existentes para destacar “Já Candidatado”
    if (role === 'athlete') {
      axios
        .get('http://localhost:3001/api/applications')
        .then((res) => {
          const candidIds = res.data
            .filter((app) => app.athlete_id === userId)
            .map((app) => app.opportunity_id);
          setMyApps(candidIds);
        })
        .catch(() => {
          /* não tratar falha aqui, apenas não teremos o destaque */
        });
    }
  }, [role, userId]);

  const handleApply = (oppId) => {
    axios
      .post('http://localhost:3001/api/applications', {
        athlete_id: userId,
        opportunity_id: oppId,
      })
      .then(() => {
        setMyApps((prev) => [...prev, oppId]);
        alert('Candidatura efetuada com sucesso!');
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.error ||
            'Erro ao realizar candidatura. Tente novamente.'
        );
      });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Vagas Disponíveis</h2>

        {/* Mostrar botão “Nova Oportunidade” apenas para company ou admin */}
        {(role === 'company' || role === 'admin') && (
          <Link
            to="/opportunities/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Nova Oportunidade
          </Link>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {opps.length === 0 && !error && (
        <p className="text-gray-600">Não há vagas cadastradas no momento.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opps.map((op) => (
          <div
            key={op.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
          >
            <div className="p-4 flex-1">
              <h3 className="text-xl font-medium mb-2">{op.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Prazo:{' '}
                {op.deadline
                  ? new Date(op.deadline).toLocaleDateString()
                  : '—'}
              </p>
              <p className="text-gray-700 mb-4">
                {op.description.length > 100
                  ? op.description.slice(0, 100) + '…'
                  : op.description}
              </p>
            </div>

            <div className="px-4 pb-4 flex space-x-2">
              {/* Detalhes sempre visível */}
              <Link
                to={`/opportunities/${op.id}`}
                className="text-blue-600 hover:underline"
              >
                Detalhes
              </Link>

              {/* Se for COMPANY ou ADMIN: "Editar" */}
              {(role === 'company' || role === 'admin') && (
                <Link
                  to={`/opportunities/edit/${op.id}`}
                  className="text-green-600 hover:underline"
                >
                  Editar
                </Link>
              )}

              {/* Se for ATHLETE: botão de candidatura ou “Já Candidatado” */}
              {role === 'athlete' && (
                <>
                  {myApps.includes(op.id) ? (
                    <button
                      className="text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      Já Candidatado
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(op.id)}
                      className="text-green-600 hover:underline"
                    >
                      Candidatar-se
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
