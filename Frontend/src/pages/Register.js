// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Register.css';

export default function Register() {
  const navigate = useNavigate();

  // qual aba está ativa: 'atleta' ou 'empresa'
  const [tab, setTab] = useState('atleta');
  // passo atual: 1, 2 ou 3
  const [step, setStep] = useState(1);

  // Form state para atleta e empresa
  const [athleteForm, setAthleteForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    anoNascimento: '',
    cidade: '',
    genero: '',
    terms: false
  });
  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cnpj: '',
    telefone: '',
    razaoSocial: '',
    cidade: '',
    orgType: '',
    sport: '',
    country: '',
    companyTerms: false
  });

  // Para exibir erros de validação
  const [formErrors, setFormErrors] = useState({});

  // troca de aba
  const selectTab = t => {
    setTab(t);
    setStep(1);
    setFormErrors({});
  };

  // avançar passo
  const next = () => {
    const errs = {};

    if (tab === 'atleta') {
      if (step === 1) {
        if (!athleteForm.name) errs.name = true;
        if (!athleteForm.email) errs.email = true;
        if (!athleteForm.password) errs.password = true;
        if (!athleteForm.confirmPassword) errs.confirmPassword = true;
        if (!/^\d{11}$/.test(athleteForm.cpf)) errs.cpf = true;
      }
      if (step === 2) {
        if (!athleteForm.anoNascimento) errs.anoNascimento = true;
        if (!athleteForm.genero) errs.genero = true;
      }
    } else {
      if (step === 1) {
        if (!companyForm.name) errs.name = true;
        if (!companyForm.email) errs.email = true;
        if (!companyForm.password) errs.password = true;
        if (!companyForm.confirmPassword) errs.confirmPassword = true;
        if (!companyForm.cnpj) errs.cnpj = true;
        if (!companyForm.razaoSocial) errs.razaoSocial = true;
        if (!companyForm.telefone) errs.telefone = true;
      }
      if (step === 2) {
        if (!companyForm.orgType) errs.orgType = true;
        if (!companyForm.sport) errs.sport = true;
        if (!companyForm.cidade) errs.cidade = true;
        if (!companyForm.country) errs.country = true;
      }
    }

    if (Object.keys(errs).length) {
      setFormErrors(errs);
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // marca completed dos passos anteriores
    document.querySelectorAll('.step').forEach(el => {
      const s = parseInt(el.dataset.step, 10);
      el.classList.toggle('completed', s < step + 1);
    });

    setStep(step + 1);
  };

  // voltar passo
  const prev = () => {
    const prevStep = step - 1;
    document.querySelectorAll('.step').forEach(el => {
      const s = parseInt(el.dataset.step, 10);
      el.classList.toggle('active', s === prevStep);
      el.classList.toggle('completed', s < prevStep);
    });
    setStep(prevStep);
  };

  // concluir cadastro
  const complete = () => {
    const termsChecked =
      tab === 'atleta' ? athleteForm.terms : companyForm.companyTerms;
    if (!termsChecked) {
      alert('Aceite os Termos de Serviço para continuar.');
      return;
    }

    let payload;
    if (tab === 'atleta') {
      const f = athleteForm;
      payload = {
        role: 'athlete',
        name: f.name,
        email: f.email,
        password: f.password,
        cpf: f.cpf,
        anoNascimento: f.anoNascimento,
        cidade: f.cidade,
        genero: f.genero
      };
    } else {
      const f = companyForm;
      payload = {
        role: 'company',
        name: f.name,
        email: f.email,
        password: f.password,
        cnpj: f.cnpj,
        razaoSocial: f.razaoSocial,
        telefone: f.telefone,
        cidade: f.cidade
      };
    }

    axios
      .post('http://localhost:3001/auth/register', payload)
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        navigate('/login');
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Erro no cadastro.');
      });
  };

  return (
    <section className="register-section">
      <div className="container">
        <div className="register-card animate__animated animate__fadeIn">
          <div className="register-header">
            <img src="/SportsIn sem fundo.png" alt="SportsIn Logo" />
            <h2>Crie sua conta</h2>
            <p>Junte-se à maior comunidade esportiva do país</p>
          </div>

          <div className="register-body">
            {/* abas */}
            <div className="register-tabs">
              {['atleta', 'empresa'].map(t => (
                <div
                  key={t}
                  className={`register-tab ${tab === t ? 'active' : ''}`}
                  onClick={() => selectTab(t)}
                >
                  {t === 'atleta' ? 'Sou Atleta' : 'Sou Empresa/Time'}
                </div>
              ))}
            </div>

            {/* passos */}
            <div className="progress-steps">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  data-step={s}
                  className={`step ${
                    step === s ? 'active' : ''
                  }${step > s ? ' completed' : ''}`}
                >
                  <div className="step-number">{s}</div>
                  <div className="step-text">
                    {s === 1
                      ? 'Informações Básicas'
                      : s === 2
                      ? tab === 'atleta'
                        ? 'Perfil Esportivo'
                        : 'Perfil Empresa'
                      : 'Confirmação'}
                  </div>
                </div>
              ))}
            </div>

            {/* conteúdo dos passos */}
            <div className="tab-content active">
              {/* Passo 1 - Atleta */}
              {step === 1 && tab === 'atleta' && (
                <div className="step-content" data-step="1">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.name ? 'is-invalid' : ''
                        }`}
                        placeholder="Nome completo"
                        value={athleteForm.name}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            name: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className={`form-control ${
                          formErrors.email ? 'is-invalid' : ''
                        }`}
                        placeholder="E-mail"
                        value={athleteForm.email}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            email: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <input
                        type="password"
                        className={`form-control ${
                          formErrors.password ? 'is-invalid' : ''
                        }`}
                        placeholder="Senha"
                        value={athleteForm.password}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            password: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="password"
                        className={`form-control ${
                          formErrors.confirmPassword ? 'is-invalid' : ''
                        }`}
                        placeholder="Confirmar senha"
                        value={athleteForm.confirmPassword}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            confirmPassword: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.cpf ? 'is-invalid' : ''
                        }`}
                        placeholder="CPF (11 dígitos)"
                        maxLength={11}
                        value={athleteForm.cpf}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            cpf: e.target.value.replace(/\D/g, '')
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary disabled">
                      Voltar
                    </button>
                    <button className="btn btn-primary" onClick={next}>
                      Próximo
                    </button>
                  </div>
                </div>
              )}
              {/* Passo 1 Empresa */}
              {step === 1 && tab === 'empresa' && (
                <div className="step-content" data-step="1">
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={'form-control ' + (formErrors.name ? 'is-invalid' : '')}
                        placeholder="Nome da empresa/time"
                        value={companyForm.name}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className={'form-control ' + (formErrors.email ? 'is-invalid' : '')}
                        placeholder="E-mail corporativo"
                        value={companyForm.email}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="password"
                        className={'form-control ' + (formErrors.password ? 'is-invalid' : '')}
                        placeholder="Senha"
                        value={companyForm.password}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        className={'form-control ' + (formErrors.confirmPassword ? 'is-invalid' : '')}
                        placeholder="Confirmar senha"
                        value={companyForm.confirmPassword}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, confirmPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.cnpj ? 'is-invalid' : ''
                        }`}
                        placeholder="CNPJ"
                        value={companyForm.cnpj}
                        onChange={e =>
                          setCompanyForm({
                            ...companyForm,
                            cnpj: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Nova linha para Razão Social */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={'form-control ' + (formErrors.razaoSocial ? 'is-invalid' : '')}
                        placeholder="Razão Social"
                        value={companyForm.razaoSocial}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, razaoSocial: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="tel"
                        className={'form-control ' + (formErrors.telefone ? 'is-invalid' : '')}
                        placeholder="Telefone para contato"
                        value={companyForm.telefone}
                        onChange={e =>
                          setCompanyForm({ ...companyForm, telefone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary disabled">
                      Voltar
                    </button>
                    <button className="btn btn-primary next-step" onClick={next}>
                      Próximo
                    </button>
                  </div>
                </div>
              )}
              {/* Passo 2 - Atleta */}
              {step === 2 && tab === 'atleta' && (
                <div className="step-content" data-step="2">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <select
                        className={`form-select ${
                          formErrors.genero ? 'is-invalid' : ''
                        }`}
                        value={athleteForm.genero}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            genero: e.target.value
                          })
                        }
                      >
                        <option value="" disabled>
                          Gênero
                        </option>
                        <option>Masculino</option>
                        <option>Feminino</option>
                        <option>Outro</option>
                        <option>Prefiro não informar</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.anoNascimento ? 'is-invalid' : ''
                        }`}
                        placeholder="Ano de Nascimento"
                        value={athleteForm.anoNascimento}
                        onChange={e =>
                          setAthleteForm({
                            ...athleteForm,
                            anoNascimento: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={prev}>
                      Voltar
                    </button>
                    <button className="btn btn-primary" onClick={next}>
                      Próximo
                    </button>
                  </div>
                </div>
              )}

              {/* Passo 2 - Empresa */}
              {step === 2 && tab === 'empresa' && (
                <div className="step-content" data-step="2">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <select
                        className={`form-select ${
                          formErrors.orgType ? 'is-invalid' : ''
                        }`}
                        value={companyForm.orgType}
                        onChange={e =>
                          setCompanyForm({
                            ...companyForm,
                            orgType: e.target.value
                          })
                        }
                      >
                        <option value="" disabled>
                          Tipo de organização
                        </option>
                        <option>Clube esportivo</option>
                        <option>Time profissional</option>
                        <option>Organização de eSports</option>
                        <option>Empresa de eventos</option>
                        <option>Outra</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <select
                        className={`form-select ${
                          formErrors.sport ? 'is-invalid' : ''
                        }`}
                        value={companyForm.sport}
                        onChange={e =>
                          setCompanyForm({
                            ...companyForm,
                            sport: e.target.value
                          })
                        }
                      >
                        <option value="" disabled>
                          Modalidade principal
                        </option>
                        <option>Futebol</option>
                        <option>Basquete</option>
                        <option>Vôlei</option>
                        <option>Tênis</option>
                        <option>CS:GO</option>
                        <option>League of Legends</option>
                        <option>Valorant</option>
                        <option>FIFA</option>
                        <option>Outra</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.cidade ? 'is-invalid' : ''
                        }`}
                        placeholder="Cidade"
                        value={companyForm.cidade}
                        onChange={e =>
                          setCompanyForm({
                            ...companyForm,
                            cidade: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.country ? 'is-invalid' : ''
                        }`}
                        placeholder="País"
                        value={companyForm.country}
                        onChange={e =>
                          setCompanyForm({
                            ...companyForm,
                            country: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={prev}>
                      Voltar
                    </button>
                    <button className="btn btn-primary" onClick={next}>
                      Próximo
                    </button>
                  </div>
                </div>
              )}

              {/* Passo 3 — revisão e confirmação */}
              {step === 3 && (
                <div className="step-content" data-step="3">
                  <div className="text-center mb-4">
                    <i
                      className="fas fa-check-circle text-success"
                      style={{ fontSize: 60 }}
                    ></i>
                    <h3 className="mt-3">Confirme seus dados</h3>
                    <p className="text-muted">
                      Revise as informações antes de finalizar o cadastro
                    </p>
                  </div>

                  {/* revisão */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">
                        {tab === 'atleta'
                          ? 'Informações Pessoais'
                          : 'Informações da Empresa'}
                      </h5>
                      {tab === 'atleta' ? (
                        <>
                          <p className="mb-1">
                            <strong>Nome:</strong> {athleteForm.name}
                          </p>
                          <p className="mb-1">
                            <strong>E-mail:</strong> {athleteForm.email}
                          </p>
                          <p className="mb-1">
                            <strong>CPF:</strong> {athleteForm.cpf}
                          </p>
                          <p className="mb-1">
                            <strong>Data de Nascimento:</strong>{' '}
                            {athleteForm.anoNascimento}
                          </p>
                          <p className="mb-1">
                            <strong>Gênero:</strong> {athleteForm.genero}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mb-1">
                            <strong>Nome:</strong> {companyForm.name}
                          </p>
                          <p className="mb-1">
                            <strong>E-mail:</strong> {companyForm.email}
                          </p>
                          <p className="mb-1">
                            <strong>CNPJ:</strong> {companyForm.cnpj}
                          </p>
                          <p className="mb-1">
                            <strong>Razão Social:</strong> {companyForm.razaoSocial}
                          </p>
                          <p className="mb-1">
                            <strong>Tipo:</strong> {companyForm.orgType}
                          </p>
                          <p className="mb-1">
                            <strong>Modalidade:</strong> {companyForm.sport}
                          </p>
                          <p className="mb-1">
                            <strong>Localização:</strong> {companyForm.cidade},{' '}
                            {companyForm.country}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="form-check mt-4">
                    {tab === 'atleta' && (
                      <>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="terms"
                          checked={athleteForm.terms}
                          onChange={e =>
                            setAthleteForm(f => ({
                              ...f,
                              terms: e.target.checked
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="terms">
                          Concordo com os Termos de Serviço e Política de
                          Privacidade
                        </label>
                      </>
                    )}
                    {tab === 'empresa' && (
                      <>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="company-terms"
                          checked={companyForm.companyTerms}
                          onChange={e =>
                            setCompanyForm(f => ({
                              ...f,
                              companyTerms: e.target.checked
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="company-terms"
                        >
                          Concordo com os Termos de Serviço e Política de
                          Privacidade
                        </label>
                      </>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={prev}>
                      Voltar
                    </button>
                    <button className="btn btn-success" onClick={complete}>
                      Completar Cadastro
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="register-footer text-center mt-4">
              <p>
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
