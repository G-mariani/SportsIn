import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error("Erro ao buscar usuários:", error));
  }, []);

  // Função para deletar usuário
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      axios.delete(`http://localhost:3001/api/users/${id}`)
        .then(response => {
          alert(response.data.message);
          // Atualiza a lista após exclusão
          setUsers(users.filter(user => user.id !== id));
        })
        .catch(error => console.error("Erro ao excluir usuário:", error));
    }
  };

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <Link to={`/detail/${user.id}`}>Detalhes</Link>
                {' | '}
                <Link to={`/edit/${user.id}`}>Editar</Link>
                {' | '}
                <button onClick={() => handleDelete(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
