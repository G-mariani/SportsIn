import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', cnpj:'', razaoSocial:'', cidade:'' });
  useEffect(()=>{ if(id) axios.get(`http://localhost:3001/api/companies/${id}`).then(r=>setForm(r.data)); },[id]);
  const handleChange = e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit = e=>{ e.preventDefault(); const req=id?axios.put(`http://localhost:3001/api/companies/${id}`,form):axios.post('http://localhost:3001/api/companies',form); req.then(()=>navigate('/companies')).catch(console.error); };
  return (
    <div>
      <h2>{id?'Editar':'Nova'} Empresa</h2>
      <form onSubmit={handleSubmit}>
        {['name','cnpj','razaoSocial','cidade'].map(f=>(
          <div key={f}>
            <label>{f}:</label>
            <input name={f} value={form[f]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}