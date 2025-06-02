import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/users/${id}`)
      .then(response => setUser(response.data))
      .catch(error => console.error("Erro ao buscar detalhes do usuário:", error));
  }, [id]);

  if (!user) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Detalhes do Usuário</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Ano de Nascimento:</strong> {user.anoNascimento}</p>
      <p><strong>Endereço:</strong> {user.cidade}</p>
      <p><strong>Gênero:</strong> {user.genero}</p>
      <p><strong>CPF:</strong> {user.cpf}</p>
    </div>
  );
};

export default UserDetail;
