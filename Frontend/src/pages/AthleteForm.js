import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
export default function AthleteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', anoNascimento:'', genero:'', endereco:'', cpf:'' });
  useEffect(() => {
    if(id) axios.get(`http://localhost:3001/api/athletes/${id}`).then(r=>setForm(r.data));
  },[id]);
  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    const req = id
      ? axios.put(`http://localhost:3001/api/athletes/${id}`, form)
      : axios.post('http://localhost:3001/api/athletes', form);
    req.then(()=>navigate('/athletes')).catch(console.error);
  };
  return (
    <div>
      <h2>{id ? 'Editar' : 'Novo'} Atleta</h2>
      <form onSubmit={handleSubmit}>
        {['name','anoNascimento','genero','cidade','cpf'].map(f => (
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