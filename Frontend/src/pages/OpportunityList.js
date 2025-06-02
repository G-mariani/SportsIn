import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function OpportunityList() {
  const [ops, setOps] = useState([]);
  useEffect(()=>axios.get('http://localhost:3001/api/opportunities').then(r=>setOps(r.data)),[]);
  return (<div><h2>Oportunidades</h2><Link to="/opportunities/new">Nova Oportunidade</Link><ul>{ops.map(o=>(<li key={o.id}>{o.title} <Link to={`/opportunities/${o.id}`}>Detalhes</Link> <Link to={`/opportunities/edit/${o.id}`}>Editar</Link></li>))}</ul></div>);
}