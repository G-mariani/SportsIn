import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [error, setError] = useState('');

  const role = localStorage.getItem('role');        // "athlete" | "company" | "admin"
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/athletes')
      .then((res) => {
        let all = res.data;

        if (role === 'athlete') {
          // colocar o atleta logado em primeiro lugar
          const me = all.find((a) => a.user_id === userId);
          const others = all.filter((a) => a.user_id !== userId);
          all = me ? [me, ...others] : all;
        }

        setAthletes(all);
      })
      .catch(() => setError('Erro ao buscar atletas'));
  }, [role, userId]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Lista de Atletas</h2>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {athletes.map((ath) => {
          const isMe = ath.user_id === userId;

          return (
            <div
              key={ath.id}
              className={
                `p-4 bg-white rounded shadow flex justify-between items-center ` +
                (isMe ? 'border-2 border-primary' : '')
              }
            >
              <div>
                <p className="text-lg font-medium">
                  {ath.name}{' '}
                  {isMe && (
                    <span className="ml-2 inline-block bg-primary text-white text-xs px-2 py-1 rounded">
                      Você
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {ath.genero} · {ath.cidade}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/athletes/${ath.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Detalhes
                </Link>
                {((role === 'athlete' && isMe) || role === 'admin') && (
                  <Link
                    to={`/athletes/edit/${ath.id}`}
                    className="text-green-600 hover:underline"
                  >
                    Editar
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
