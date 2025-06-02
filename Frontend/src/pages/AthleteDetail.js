import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export default function AthleteDetail() {
  const { id } = useParams();
  const [athlete, setAthlete] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:3001/api/athletes/${id}`)
      .then(r=>setAthlete(r.data));
  },[id]);
  if(!athlete) return <p>Carregando...</p>;
  return (
    <div>
      <h2>Detalhes do Atleta</h2>
      {Object.entries(athlete).map(([key,val])=> <p key={key}><strong>{key}:</strong> {val}</p>)}
    </div>
  );
}