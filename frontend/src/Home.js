import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

function Home() {
  const navigate = useNavigate();

  return (
    <LobbyContainer>
      <Header>
        <Title>Bem-vindo à WorldWeaver</Title>
        <Subtitle>Seu ponto de partida para novas aventuras.</Subtitle>
      </Header>
      
      <CardsContainer>
        <CardLink href="#/global/global">
          <ActionCard>
            <CardIcon>📜</CardIcon>
            <CardTitle>Mural & Chat Global</CardTitle>
            <CardDescription>Veja os avisos da plataforma, divulgue suas mesas e converse com outros jogadores.</CardDescription>
          </ActionCard>
        </CardLink>

        <ActionCard>
          <CardIcon>🔗</CardIcon>
          <CardTitle>Entrar em uma Comunidade</CardTitle>
          <CardDescription>Recebeu um convite? Cole o link abaixo para se juntar a uma comunidade existente.</CardDescription>
          <Input placeholder="Cole o link de convite..." />
          <Button disabled>Entrar</Button>
        </ActionCard>

        {/* --- MUDANÇA AQUI --- */}
        <ActionCard onClick={() => navigate('/create-community')}>
          <CardIcon>➕</CardIcon>
          <CardTitle>Criar sua Comunidade</CardTitle>
          <CardDescription>Seja o mestre de sua própria aventura. Crie sua comunidade e convide seus amigos.</CardDescription>
           <Button>Criar</Button>
        </ActionCard>
        {/* --- FIM DA MUDANÇA --- */}
      </CardsContainer>
    </LobbyContainer>
  );
}

// (O resto do arquivo Home.js com os estilos continua o mesmo)
const LobbyContainer = styled.div`
  flex-grow: 1; padding: 40px 20px; background-color: #36393f; color: #dcddde; display: flex; flex-direction: column; align-items: center; overflow-y: auto; width: 100%;
`;
const Header = styled.div`
  text-align: center; margin-bottom: 40px;
`;
const Title = styled.h1`
  font-size: 2.2em; margin-bottom: 10px; color: #ffffff;
  @media (max-width: 768px) { font-size: 1.8em; }
`;
const Subtitle = styled.p`
  font-size: 1.1em; color: #b9bbbe;
  @media (max-width: 768px) { font-size: 1em; }
`;
const CardsContainer = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%; max-width: 1200px;
`;
const ActionCard = styled.div`
  background-color: #2f3136; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid #202225; transition: transform 0.2s, box-shadow 0.2s; height: 100%; box-sizing: border-box;
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  ${CardLink}:hover & { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); }
  &:hover { ${props => props.onClick && `transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);`} }
`;
const CardIcon = styled.div`
  font-size: 3em; margin-bottom: 15px;
`;
const CardTitle = styled.h3`
  font-size: 1.5em; color: #ffffff; margin-bottom: 10px;
`;
const CardDescription = styled.p`
  color: #b9bbbe; line-height: 1.5; flex-grow: 1; margin-bottom: 20px;
`;
const Input = styled.input`
  width: 100%; padding: 12px; border-radius: 5px; border: 1px solid #202225; background-color: #40444b; color: #dcddde; margin-bottom: 10px;
  &::placeholder { color: #8e9297; }
`;
const Button = styled.button`
  width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #5865f2; color: white; font-weight: bold; cursor: pointer; transition: background-color 0.2s;
  &:hover { background-color: #4752c4; }
  &:disabled { background-color: #40444b; cursor: not-allowed; opacity: 0.7; }
`;

export default Home;