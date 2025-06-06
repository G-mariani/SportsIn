require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PUC@1234',
  database: 'SportsIn'
});

db.connect(err => {
  if (err) console.error('Erro ao conectar com MySQL:', err);
  else console.log('Conexão MySQL estabelecida com sucesso!');
});

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Rota de registro (atleta ou empresa)
app.post('/auth/register', async (req, res) => {
  const {
    role, name, anoNascimento, genero, cidade,
    cpf, cnpj, razaoSocial, email, password
  } = req.body;

  // Valida campos obrigatórios
  if (role === 'athlete') {
    if (!name || !anoNascimento || !genero || !cidade || !cpf || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios para atleta.' });
    }
  } else if (role === 'company') {
    if (!name || !cnpj || !razaoSocial || !cidade || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios para empresa.' });
    }
  } else {
    return res.status(400).json({ error: 'Role inválido.' });
  }

  try {
    // Cria hash da senha
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insere em users
    const [userResult] = await db.promise().query(
      'INSERT INTO users (password, role) VALUES (?, ?)',
      [hash, role]
    );
    const userId = userResult.insertId;

    // Insere perfil
    if (role === 'athlete') {
      await db.promise().query(
        'INSERT INTO athletes (user_id, name, anoNascimento, genero, cidade, cpf) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, anoNascimento, genero, cidade, cpf]
      );
    } else {
      await db.promise().query(
        'INSERT INTO companies (user_id, name, cnpj, razaoSocial, cidade, email) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, cnpj, razaoSocial, cidade, email]
      );
    }

    res.status(201).json({ message: 'Registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota de login (CPF ou CNPJ)
app.post('/auth/login', async (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'CPF/CNPJ e senha são obrigatórios.' });
  }
  const field = role === 'athlete' ? 'cpf' : 'cnpj';
  const table = role === 'athlete' ? 'athletes' : 'companies';

  try {
    const [rows] = await db.promise().query(
      `SELECT u.id, u.password FROM users u JOIN ${table} p ON p.user_id = u.id WHERE p.${field} = ?`,
      [identifier]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: `${field.toUpperCase()} não cadastrado.` });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    return res.json({
      message: 'Autenticado com sucesso!',
      token,
      role,
      userId: user.id
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// --- Endpoints de Atletas ---
app.get('/api/athletes', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM athletes');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/athletes/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM athletes WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/athletes', authenticateToken, async (req, res) => {
  const { user_id, name, anoNascimento, genero, cidade, cpf } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO athletes (user_id, name, anoNascimento, genero, cidade, cpf) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, name, anoNascimento, genero, cidade, cpf]
    );
    res.status(201).json({ athleteId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/athletes/:id', authenticateToken, async (req, res) => {
  const { name, anoNascimento, genero, cidade, cpf } = req.body;
  try {
    await db.promise().query(
      'UPDATE athletes SET name=?, anoNascimento=?, genero=?, cidade=?, cpf=? WHERE id=?',
      [name, anoNascimento, genero, cidade, cpf, req.params.id]
    );
    res.json({ message: 'Atleta atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/athletes/:id', authenticateToken, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM athletes WHERE id=?', [req.params.id]);
    res.json({ message: 'Atleta removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints de Empresas ---
app.get('/api/companies', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM companies');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/companies', authenticateToken, async (req, res) => {
  const { user_id, name, cnpj, razaoSocial, cidade, email } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO companies (user_id, name, cnpj, razaoSocial, cidade, email) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, name, cnpj, razaoSocial, cidade, email]
    );
    res.status(201).json({ companyId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/companies/:id', authenticateToken, async (req, res) => {
  const { name, cnpj, razaoSocial, cidade, email } = req.body;
  try {
    await db.promise().query(
      'UPDATE companies SET name=?, cnpj=?, razaoSocial=?, cidade=?, email=? WHERE id=?',
      [name, cnpj, razaoSocial, cidade, email, req.params.id]
    );
    res.json({ message: 'Empresa atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM companies WHERE id=?', [req.params.id]);
    res.json({ message: 'Empresa removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints de Oportunidades ---
app.get('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM opportunities');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/opportunities', authenticateToken, async (req, res) => {
  const { company_id, title, description, requirements, deadline } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO opportunities (company_id, title, description, requirements, deadline) VALUES (?, ?, ?, ?, ?)',
      [company_id, title, description, requirements, deadline]
    );
    res.status(201).json({ opportunityId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/opportunities/:id', authenticateToken, async (req, res) => {
  const { title, description, requirements, deadline } = req.body;
  try {
    await db.promise().query(
      'UPDATE opportunities SET title=?, description=?, requirements=?, deadline=? WHERE id=?',
      [title, description, requirements, deadline, req.params.id]
    );
    res.json({ message: 'Oportunidade atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM opportunities WHERE id=?', [req.params.id]);
    res.json({ message: 'Oportunidade removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Endpoints de Candidaturas ---
app.post('/api/applications', authenticateToken, async (req, res) => {
  const { athlete_id, opportunity_id } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO applications (athlete_id, opportunity_id) VALUES (?, ?)',
      [athlete_id, opportunity_id]
    );
    res.status(201).json({ applicationId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM applications');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Candidatura removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
