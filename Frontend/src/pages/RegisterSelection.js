import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterSelection() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Registro</h2>
      <p>Escolha o tipo de conta:</p>
      <button onClick={() => navigate('/register/athlete')}>Sou Atleta</button>
      <button onClick={() => navigate('/register/company')}>Sou Empresa</button>
    </div>
  );
}