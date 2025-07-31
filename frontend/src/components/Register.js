import React, { useState } => 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const BACKEND_URL = "https://plataforma-rpg.onrender.com"; // <-- SEU URL REAL AQUI!

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: name, email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Registro bem-sucedido! Redirecionando...');
        console.log('Registro bem-sucedido. Token:', data.token);
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
        navigate('/hogwarts/geral');
      } else {
        setMessage(data.msg || 'Erro ao registrar. Tente novamente.');
        console.error('Erro de registro:', data.msg);
      }
    } catch (error) {
      console.error('Erro de rede ou servidor:', error);
      setMessage('Não foi possível conectar ao servidor. Verifique sua internet.');
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Title>Registrar</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nome de Usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit">Registrar</Button>
        </Form>
        {message && <MessageText error={!response?.ok}>{message}</MessageText>}
        <LinkText>
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </LinkText>
      </AuthBox>
    </AuthContainer>
  );
}

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2f3136;
  color: #dcddde;
  font-family: 'Roboto', sans-serif;
`;

const AuthBox = styled.div`
  background-color: #36393f;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2em;
  margin-bottom: 25px;
  color: #ffffff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #40444b;
  border-radius: 4px;
  background-color: #40444b;
  color: #dcddde;
  font-size: 1em;
  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px #5865f2;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #5865f2;
  color: white;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #4752c4;
  }
`;

const MessageText = styled.p`
  margin-top: 20px;
  font-size: 0.9em;
  color: ${props => props.error ? '#ff5555' : '#55ff55'};
`;

const LinkText = styled.p`
  margin-top: 20px;
  font-size: 0.9em;
  a {
    color: #5865f2;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register;
