import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterCompany() {
  const [form, setForm] = useState({
    name: '', cnpj: '', razaoSocial: '', cidade: '', email: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(errs => ({ ...errs, [e.target.name]: '' }));
  };

  // validação cnpj números somente e 14 dígitos
  const validate = () => {
    const errs = {};
    if (!/^\d{14}$/.test(form.cnpj)) {
      errs.cnpj = 'CNPJ deve conter exatamente 14 dígitos numéricos.';
    }
    if (!form.email.includes('@')) {
      errs.email = 'E-mail inválido.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('http://localhost:3001/auth/register', { ...form, role: 'company' });
      navigate('/login');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Erro no registro da empresa');
    }
  };

  return (
    <div>
      <h2>Registrar Empresa</h2>
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input name="cnpj" placeholder="CNPJ" maxLength={14} value={form.cnpj} onChange={handleChange} required />
        {errors.cnpj && <div style={{ color:'red' }}>{errors.cnpj}</div>}
        <input name="razaoSocial" placeholder="Razão Social" value={form.razaoSocial} onChange={handleChange} required />
        <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />
        <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
        {errors.email && <div style={{ color:'red' }}>{errors.email}</div>}
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
        <button type="submit">Registrar Empresa</button>
      </form>
      <p>Já tem conta? <Link to="/login">Login</Link></p>
    </div>
  );
}