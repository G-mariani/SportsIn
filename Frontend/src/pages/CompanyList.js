/* src/pages/CompanyList.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/companies')
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

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
        {companies.map((company) => (
          <div
            key={company.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{company.name}</p>
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
              <Link
                to={`/companies/edit/${company.id}`}
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
