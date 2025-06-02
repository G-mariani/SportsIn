import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    anoNascimento: '',
    cidade: '',
    genero: '',
    cpf: ''
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/users/${id}`)
        .then(response => setUser(response.data))
        .catch(error => console.error("Erro ao obter usuário:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Atualiza usuário existente
      axios.put(`http://localhost:3001/api/users/${id}`, user)
        .then(response => {
          alert(response.data.message);
          navigate('/');
        })
        .catch(error => console.error("Erro ao atualizar usuário:", error));
    } else {
      // Cria novo usuário
      axios.post('http://localhost:3001/api/users', user)
        .then(response => {
          alert(response.data.message);
          navigate('/');
        })
        .catch(error => console.error("Erro ao criar usuário:", error));
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Ano de Nascimento:</label>
          <input type="number" name="anoNascimento" value={user.anoNascimento} onChange={handleChange} required />
        </div>
        <div>
          <label>Endereço:</label>
          <input type="text" name="cidade" value={user.cidade} onChange={handleChange} required />
        </div>
        <div>
          <label>Gênero:</label>
          <input type="text" name="genero" value={user.genero} onChange={handleChange} required />
        </div>
        <div>
          <label>CPF:</label>
          <input type="text" name="cpf" value={user.cpf} onChange={handleChange} required />
        </div>
        <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

export default UserForm;
