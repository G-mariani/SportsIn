import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

// auth pages
import Login from './pages/Login';
import RegisterSelection from './pages/RegisterSelection';
import RegisterAthlete from './pages/RegisterAthlete';
import RegisterCompany from './pages/RegisterCompany';
import ProtectedRoute from './components/ProtectedRoute';

// entity pages
import AthleteList from './pages/AthleteList';
import AthleteForm from './pages/AthleteForm';
import AthleteDetail from './pages/AthleteDetail';
import CompanyList from './pages/CompanyList';
import CompanyForm from './pages/CompanyForm';
import CompanyDetail from './pages/CompanyDetail';
import OpportunityList from './pages/OpportunityList';
import OpportunityForm from './pages/OpportunityForm';
import OpportunityDetail from './pages/OpportunityDetail';
import ApplicationList from './pages/ApplicationList';
import ManageApplications from './pages/ManageApplications';

const token = localStorage.getItem('token');
if(token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/register/athlete" element={<RegisterAthlete />} />
        <Route path="/register/company" element={<RegisterCompany />} />

        <Route path="/*" element={
          <ProtectedRoute>
            <header>
              <h1>SportsIn</h1>
              <nav>
                <Link to="/athletes">Atletas</Link> | 
                <Link to="/companies">Empresas</Link> | 
                <Link to="/opportunities">Oportunidades</Link> | 
                <Link to="/applications">Minhas Candidaturas</Link> | 
                <Link to="/manage-applications">Gerenciar Candidaturas</Link> | 
                <button onClick={handleLogout}>Logout</button>
              </nav>
            </header>
            <main>
              <Routes>
                <Route path="athletes" element={<AthleteList />} />
                <Route path="athletes/new" element={<AthleteForm />} />
                <Route path="athletes/edit/:id" element={<AthleteForm />} />
                <Route path="athletes/:id" element={<AthleteDetail />} />

                <Route path="companies" element={<CompanyList />} />
                <Route path="companies/new" element={<CompanyForm />} />
                <Route path="companies/edit/:id" element={<CompanyForm />} />
                <Route path="companies/:id" element={<CompanyDetail />} />

                <Route path="opportunities" element={<OpportunityList />} />
                <Route path="opportunities/new" element={<OpportunityForm />} />
                <Route path="opportunities/edit/:id" element={<OpportunityForm />} />
                <Route path="opportunities/:id" element={<OpportunityDetail />} />

                <Route path="applications" element={<ApplicationList />} />
                <Route path="manage-applications" element={<ManageApplications />} />

                <Route path="*" element={<Navigate to="/athletes" />} />
              </Routes>
            </main>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
