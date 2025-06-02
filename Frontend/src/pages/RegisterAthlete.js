import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterAthlete() {
  const [form, setForm] = useState({ name: '', anoNascimento: '', cidade: '', genero: '', cpf: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/register', { ...form, role: 'athlete' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no registro de atleta');
    }
  };

  return (
    <div>
      <h2>Registrar Atleta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input name="anoNascimento" placeholder="Ano de Nascimento" value={form.anoNascimento} onChange={handleChange} required />
        <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />
        <div>
            <label>Gênero:</label><br/>
            <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                required
            >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
            </select>
        </div>
        <input name="cpf" placeholder="CPF" maxLength={13} value={form.cpf} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem conta? <Link to="/login">Login</Link></p>
    </div>
  );
}