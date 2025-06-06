import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const role = localStorage.getItem('role');       // "athlete" | "company" | "admin"
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/companies')
      .then((res) => {
        let all = res.data;

        if (role === 'company') {
          // coloca a empresa logada no topo
          const me = all.find((c) => c.user_id === userId);
          const others = all.filter((c) => c.user_id !== userId);
          if (me) {
            all = [me, ...others];
          }
        }

        setCompanies(all);
      })
      .catch((err) => console.error(err));
  }, [role, userId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Lista de Empresas</h2>
        <Link
          to="/companies/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
        >
          Nova Empresa
        </Link>
      </div>

      <div className="space-y-4">
        {companies.map((company) => {
          const isMe = company.user_id === userId;
          return (
            <div
              key={company.id}
              className={
                `p-4 bg-white rounded shadow flex justify-between items-center ` +
                (isMe ? 'border-2 border-primary' : '')
              }
            >
              <div>
                <p className="text-lg font-medium">
                  {company.name}
                  {isMe && (
                    <span className="ml-2 inline-block bg-primary text-white text-xs px-2 py-1 rounded">
                      Você
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {company.cidade} · {company.razaoSocial}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/companies/${company.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Detalhes
                </Link>
                {((role === 'company' && isMe) || role === 'admin') && (
                  <Link
                    to={`/companies/edit/${company.id}`}
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
