/* src/pages/RegisterSelection.js */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Registro</h2>
        <p className="text-center text-gray-600 mb-6">Escolha o tipo de conta:</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/register/athlete')}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Sou Atleta
          </button>
          <button
            onClick={() => navigate('/register/company')}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Sou Empresa
          </button>
        </div>
      </div>
    </div>
  );
}
