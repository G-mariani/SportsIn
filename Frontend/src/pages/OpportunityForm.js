import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
export default function OpportunityForm() {
  const { id } = useParams(); const nav = useNavigate();
  const [form, setForm] = useState({ company_id:'', title:'', description:'', requirements:'', deadline:''});
  useEffect(()=>{ if(id) axios.get(`http://localhost:3001/api/opportunities/${id}`).then(r=>setForm(r.data)); },[id]);
  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit=e=>{e.preventDefault();const req=id?axios.put(`http://localhost:3001/api/opportunities/${id}`,form):axios.post('http://localhost:3001/api/opportunities',form);req.then(()=>nav('/opportunities')).catch(console.error);} ;
  return (<div><h2>{id?'Editar':'Nova'} Oportunidade</h2><form onSubmit={handleSubmit}>{Object.entries(form).map(([k,v])=><div key={k}><label>{k}:</label><input name={k} value={v} onChange={handleChange} required /></div>)}<button type="submit">Salvar</button></form></div>);
}