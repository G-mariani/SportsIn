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
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
             <h1 className="text-3xl font-bold">SportsIn</h1>
             <nav className="mt-2 space-x-4">
               <Link className="hover:underline" to="/athletes">Atletas</Link>
               <Link className="hover:underline" to="/companies">Empresas</Link>
               <Link className="hover:underline" to="/opportunities">Oportunidades</Link>
               <Link className="hover:underline" to="/applications">Minhas Candidaturas</Link>
               
               <button
                 onClick={handleLogout}
                 className="ml-4 px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
               >
                 Logout
               </button>
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
