import React from 'react';
import styled from 'styled-components';

function Home({ toggleCommunitiesSidebar, toggleChannelsSidebar }) {
  return (
    <HomeContainer>
      <MobileHeader>
        <MenuButton onClick={toggleCommunitiesSidebar}>☰ Comunidades</MenuButton>
        <MenuButton onClick={toggleChannelsSidebar}>Canais</MenuButton>
      </MobileHeader>
      <HomeTitle>Bem-vindo à Plataforma de RPG!</HomeTitle>
      <HomeText>Selecione uma comunidade e um canal ao lado para começar sua aventura.</HomeText>
      <HomeText>Em breve, funcionalidades de chat real, comunidades personalizadas e IA.</HomeText>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
  text-align: center;
  background-color: #36393f; /* Cor do chat principal */
`;

const HomeTitle = styled.h2`
  font-size: 2em;
  margin-bottom: 15px;
  color: #ffffff;
`;

const HomeText = styled.p`
  font-size: 1.1em;
  color: #dcddde;
  margin-bottom: 10px;
  max-width: 600px;
`;

const MobileHeader = styled.div`
  display: none; 
  @media (max-width: 768px) { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #202225;
    color: #dcddde;
    height: 48px;
    flex-shrink: 0;
    width: 100%; 
    position: absolute; 
    top: 0;
    left: 0;
    z-index: 100; 
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #dcddde;
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
`;

export default Home;