/* src/pages/OpportunityList.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function OpportunityList() {
  const [ops, setOps] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/opportunities')
      .then((res) => setOps(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Oportunidades</h2>
        <Link
          to="/opportunities/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
        >
          Nova Oportunidade
        </Link>
      </div>

      <div className="space-y-4">
        {ops.map((o) => (
          <div
            key={o.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{o.title}</p>
              <p className="text-sm text-gray-500">
                Prazo: {new Date(o.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/opportunities/${o.id}`}
                className="text-blue-600 hover:underline"
              >
                Detalhes
              </Link>
              <Link
                to={`/opportunities/edit/${o.id}`}
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
