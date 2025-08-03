import React, { useState } from 'react';
import styled from 'styled-components';

// Função para gerar código de convite aleatório
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code.match(/.{1,3}/g).join('-'); // Formata como ABC-DEF
};


function CommunitiesScreen() {
  // Vamos começar com a lista vazia para simular um novo usuário
  const [communities, setCommunities] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  const handleCreateCommunity = () => {
    const trimmedName = newCommunityName.trim();
    if (trimmedName) {
      const newCommunity = { 
        id: Date.now().toString(), 
        name: trimmedName, 
        icon: '🏰' 
      };
      setCommunities([...communities, newCommunity]);
      
      const inviteCode = generateInviteCode();
      // Usamos o alert nativo por enquanto para mostrar o convite
      alert(
        `Comunidade "${trimmedName}" criada com sucesso!\n\n` +
        `Seu código de convite é: ${inviteCode}\n\n` +
        `Compartilhe com seus amigos para eles entrarem.`
      );

      setNewCommunityName('');
      setShowCreateForm(false);
    }
  };

  return (
    <ScreenContainer>
      <Header>
        <h1>Suas Comunidades</h1>
        <CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>+</CreateButton>
      </Header>

      {showCreateForm && (
        <CreateForm>
          <h2>Criar Nova Comunidade</h2>
          <Input 
            type="text" 
            placeholder="Nome da Comunidade"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
          />
          <Button onClick={handleCreateCommunity}>Confirmar Criação</Button>
        </CreateForm>
      )}

      {/* Exibe a lista de comunidades ou uma mensagem se estiver vazia */}
      {communities.length > 0 ? (
        <CommunityList>
          {communities.map(community => (
            <CommunityItem key={community.id}>
              <CommunityIcon>{community.icon}</CommunityIcon>
              <CommunityName>{community.name}</CommunityName>
            </CommunityItem>
          ))}
        </CommunityList>
      ) : (
        <EmptyState>
          <p>Você ainda não faz parte de nenhuma comunidade.</p>
          <p>Clique no botão '+' acima para criar a sua primeira!</p>
        </EmptyState>
      )}
    </ScreenContainer>
  );
}

// --- ESTILOS CORRIGIDOS E MELHORADOS ---

const ScreenContainer = styled.div`
  /* Adicionamos de volta o padding para o conteúdo não colar no topo */
  padding: 20px; 
  color: #dcddde;
`;

const Header = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 30px;
  
  h1 { 
    margin: 0; 
    font-size: 1.8em; 
    color: #fff;
  }
`;

const CreateButton = styled.button`
  background-color: #5865f2; 
  color: white; 
  border: none; 
  border-radius: 50%; 
  width: 44px;
  height: 44px;
  font-size: 28px; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4752c4;
  }
`;

const CreateForm = styled.div`
  background-color: #2f3136; 
  padding: 20px; 
  border-radius: 8px; 
  margin-bottom: 30px;
  border: 1px solid #202225;
`;

const Input = styled.input`
  width: 100%; 
  padding: 12px; 
  border-radius: 5px; 
  border: none; 
  background-color: #40444b; 
  color: #dcddde; 
  margin-bottom: 15px;
`;

const Button = styled.button`
  width: 100%; 
  padding: 12px; 
  border-radius: 5px; 
  border: none; 
  background-color: #4caf50; /* Cor verde para confirmar */
  color: white; 
  font-weight: bold; 
  cursor: pointer;
`;

const CommunityList = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 10px;
`;

const CommunityItem = styled.div`
  background-color: #2f3136; 
  border-radius: 8px; 
  padding: 15px; 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #40444b;
  }
`;

const CommunityIcon = styled.span`
  font-size: 24px;
`;

const CommunityName = styled.span`
  font-size: 1.1em; 
  color: #fff;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #8e9297;
  padding: 40px 20px;
  background-color: #2f3136;
  border-radius: 8px;
`;

export default CommunitiesScreen;