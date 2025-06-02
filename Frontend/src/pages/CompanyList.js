import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/companies')
      .then(r=>setCompanies(r.data));
  },[]);
  return (
    <div>
      <h2>Lista de Empresas</h2>
      <Link to="/companies/new">Nova Empresa</Link>
      <ul>
        {companies.map(c=>(
          <li key={c.id}>
            {c.name} {' '}
            <Link to={`/companies/${c.id}`}>Detalhes</Link> {' '}
            <Link to={`/companies/edit/${c.id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}