import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <LobbyContainer>
      <Header>
        <Title>Bem-vindo à WorldWeaver</Title>
        <Subtitle>Seu ponto de partida para novas aventuras.</Subtitle>
      </Header>
      
      <CardsContainer>
        <ActionCard onClick={() => navigate('/global')}>
          <CardIcon>🌍</CardIcon>
          <CardTitle>Mural & Chat Global</CardTitle>
          <CardDescription>Veja os avisos da plataforma, divulgue suas mesas e converse com outros jogadores.</CardDescription>
        </ActionCard>
        <ActionCard onClick={() => navigate('/communities')}>
          <CardIcon>🏰</Icon>
          <CardTitle>Suas Comunidades</CardTitle>
          <CardDescription>Veja as comunidades que você participa ou crie uma nova aventura para seus amigos.</CardDescription>
        </ActionCard>
      </CardsContainer>
    </LobbyContainer>
  );
}

const LobbyContainer = styled.div`padding: 40px 20px; color: #dcddde;`;
const Header = styled.div`text-align: center; margin-bottom: 40px;`;
const Title = styled.h1`font-size: 2.2em; margin-bottom: 10px; color: #ffffff;`;
const Subtitle = styled.p`font-size: 1.1em; color: #b9bbbe;`;
const CardsContainer = styled.div`display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 600px; margin: 0 auto;`;
const ActionCard = styled.div`background-color: #2f3136; border-radius: 8px; padding: 25px; text-align: center; border: 1px solid #202225; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; &:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); }`;
const CardIcon = styled.div`font-size: 3em; margin-bottom: 15px;`;
const CardTitle = styled.h3`font-size: 1.5em; color: #ffffff; margin-bottom: 10px;`;
const CardDescription = styled.p`color: #b9bbbe; line-height: 1.5;`;

export default HomeScreen;