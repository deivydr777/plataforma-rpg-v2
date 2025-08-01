import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function CreateCommunity() {
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault(); // Impede o formulário de recarregar a página
    // No futuro, aqui iria a lógica para salvar no backend.
    // Por agora, apenas navegamos para uma página de exemplo.
    alert('Comunidade criada com sucesso! (Simulação)');
    // Exemplo de como navegaria para a nova comunidade:
    // navigate('/nome-da-comunidade/geral');
  };

  return (
    <PageContainer>
      <FormContainer onSubmit={handleCreate}>
        <Header>
          <Title>Crie sua Comunidade</Title>
          <Subtitle>Dê vida ao seu mundo e convide seus jogadores para a aventura.</Subtitle>
        </Header>
        
        <InputGroup>
          <Label htmlFor="community-name">NOME DA COMUNIDADE</Label>
          <Input id="community-name" type="text" placeholder="Ex: As Crônicas de Valéria" required />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="community-description">DESCRIÇÃO</Label>
          <TextArea id="community-description" rows="4" placeholder="Descreva o tema e o estilo de jogo da sua comunidade."></TextArea>
        </InputGroup>

        <Button type="submit">Criar Comunidade</Button>
        <BackButton type="button" onClick={() => navigate('/')}>Voltar</BackButton>

      </FormContainer>
    </PageContainer>
  );
}

// --- Estilos ---
const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #36393f;
  overflow-y: auto;
  padding: 20px;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 500px;
  background-color: #2f3136;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 1.8em;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #b9bbbe;
  font-size: 1em;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #8e9297;
  font-size: 0.8em;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #202225;
  background-color: #40444b;
  color: #dcddde;
  font-size: 1em;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #202225;
  background-color: #40444b;
  color: #dcddde;
  font-size: 1em;
  resize: vertical;
  font-family: inherit;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: none;
  background-color: #5865f2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 10px;
`;

const BackButton = styled(Button)`
  background-color: #4f545c;
`;

export default CreateCommunity;