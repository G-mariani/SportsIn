import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  useEffect(()=>axios.get(`http://localhost:3001/api/companies/${id}`).then(r=>setCompany(r.data)),[id]);
  if(!company) return <p>Carregando...</p>;
  return (<div>{Object.entries(company).map(([k,v])=> <p key={k}><strong>{k}:</strong> {v}</p>)}</div>);
}
