/* src/pages/AthleteList.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/athletes')
      .then((res) => setAthletes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Lista de Atletas</h2>
        <Link
          to="/athletes/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
        >
          Novo Atleta
        </Link>
      </div>

      <div className="space-y-4">
        {athletes.map((athlete) => (
          <div
            key={athlete.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{athlete.name}</p>
              <p className="text-sm text-gray-500">
                {athlete.genero} · {athlete.cidade}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/athletes/${athlete.id}`}
                className="text-blue-600 hover:underline"
              >
                Detalhes
              </Link>
              <Link
                to={`/athletes/edit/${athlete.id}`}
                className="text-green-600 hover:underline"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
