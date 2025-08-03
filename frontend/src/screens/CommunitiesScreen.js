import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAllCommunities, saveAllCommunities } from '../allCommunities';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let code = '';
  for (let i = 0; i < 6; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)); }
  return code.match(/.{1,3}/g).join('-');
};

function CommunitiesScreen() {
  const [myCommunities, setMyCommunities] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('worldweaver-my-communities');
    if (stored) setMyCommunities(JSON.parse(stored));
  }, []);

  const handleCreateCommunity = () => {
    const trimmedName = newCommunityName.trim();
    if (trimmedName) {
      const allCommunities = getAllCommunities();
      const inviteCode = generateInviteCode();
      const newCommunity = { 
        id: Date.now().toString(), 
        name: trimmedName, 
        icon: '🏰',
        inviteCode: inviteCode,
        channels: [{id: 'geral', name: 'geral'}, {id: 'anuncios', name: 'anuncios'}] // Canais padrão
      };

      // Salva na lista global
      saveAllCommunities([...allCommunities, newCommunity]);
      
      // Salva na lista pessoal do usuário
      setMyCommunities([...myCommunities, newCommunity]);
      
      alert(`Comunidade "${trimmedName}" criada!\n\nSeu código de convite é: ${inviteCode}`);
      setNewCommunityName('');
      setShowCreateForm(false);
    }
  };

  return (
    <ScreenContainer>
      <Header>
        <h1>Suas Comunidades</h1>
        <CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>{showCreateForm ? '×' : '+'}</CreateButton>
      </Header>
      {showCreateForm && (
        <CreateForm>
          <h2>Criar Nova Comunidade</h2>
          <Input type="text" placeholder="Nome da Comunidade" value={newCommunityName} onChange={(e) => setNewCommunityName(e.target.value)} />
          <Button onClick={handleCreateCommunity}>Confirmar Criação</Button>
        </CreateForm>
      )}
      {myCommunities.length > 0 ? (
        <CommunityList>
          {myCommunities.map(community => (
            // AQUI ESTÁ O LINK PARA ENTRAR NA COMUNIDADE (ainda não funciona, mas está pronto)
            <CommunityItem key={community.id} onClick={() => alert(`Clicou em ${community.name}`)}>
              <CommunityIcon>{community.icon}</CommunityIcon>
              <CommunityName>{community.name}</CommunityName>
            </CommunityItem>
          ))}
        </CommunityList>
      ) : (
        <EmptyState>
          <p>Você ainda não faz parte de nenhuma comunidade.</p>
          <p>Crie a sua primeira ou entre em uma com um código de convite!</p>
        </EmptyState>
      )}
    </ScreenContainer>
  );
}

// Estilos (sem alteração)
const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #36393f; top: 0; padding: 10px 0; border-bottom: 1px solid #2f3136; position: sticky; z-index: 10; h1 { margin: 0; font-size: 1.6em; }`;
const CreateButton = styled.button`background-color: #5865f2; color: white; border: none; border-radius: 50%; width: 44px; height: 44px; font-size: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;`;
const CreateForm = styled.div`background-color: #2f3136; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #202225;`;
const Input = styled.input`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #40444b; color: #dcddde; margin-bottom: 15px;`;
const Button = styled.button`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #4caf50; color: white; font-weight: bold; cursor: pointer;`;
const CommunityList = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const CommunityItem = styled.div`background-color: #2f3136; border-radius: 8px; padding: 15px; display: flex; align-items: center; gap: 15px; cursor: pointer;`;
const CommunityIcon = styled.span`font-size: 24px;`;
const CommunityName = styled.span`font-size: 1.1em; color: #fff;`;
const EmptyState = styled.div`text-align: center; color: #8e9297; padding: 40px 20px; background-color: #2f3136; border-radius: 8px;`;
export default CommunitiesScreen;