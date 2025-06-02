import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/athletes')
      .then(res => setAthletes(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h2>Lista de Atletas</h2>
      <Link to="/athletes/new">Novo Atleta</Link>
      <ul>
        {athletes.map(a => (
          <li key={a.id}>
            {a.name} {' '}
            <Link to={`/athletes/${a.id}`}>Detalhes</Link> {' '}
            <Link to={`/athletes/edit/${a.id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}