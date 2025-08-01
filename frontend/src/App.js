import React from 'react';
import styled from 'styled-components';

// Nós vamos importar o Home diretamente aqui
import Home from './Home';

// O App.js agora é SÓ ISSO. Ele renderiza o Home e nada mais.
function App() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

// Estilos mínimos para garantir que a página ocupe a tela
const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
`;

export default App;```

---

### **CÓDIGO DE EMERGÊNCIA: `frontend/src/Home.js`**

Vamos garantir que o `Home.js` não tenha nada que possa quebrar. Sem `useNavigate`, sem nada.

**Instruções:**
1.  Vai no `frontend/src/Home.js`.
2.  Apaga tudo.
3.  Copia e cola este código.

```javascript
import React from 'react';
import styled from 'styled-components';
// SEM useNavigate, SEM NADA QUE POSSA QUEBRAR

function Home() {
  return (
    <LobbyContainer>
      <Header>
        <Title>Bem-vindo à WorldWeaver</Title>
        <Subtitle>Seu ponto de partida para novas aventuras.</Subtitle>
      </Header>
      
      <CardsContainer>
        <ActionCard>
          <CardIcon>📜</CardIcon>
          <CardTitle>Mural & Chat Global</CardTitle>
          <CardDescription>Veja os avisos da plataforma, divulgue suas mesas e converse com outros jogadores.</CardDescription>
        </ActionCard>

        <ActionCard>
          <CardIcon>🔗</CardIcon>
          <CardTitle>Entrar em uma Comunidade</CardTitle>
          <CardDescription>Recebeu um convite? Cole o link abaixo para se juntar a uma comunidade existente.</Card-Description>
          <Input placeholder="Cole o link de convite..." />
          <Button disabled>Entrar</Button>
        </ActionCard>

        <ActionCard>
          <CardIcon>➕</CardIcon>
          <CardTitle>Criar sua Comunidade</CardTitle>
          <CardDescription>Seja o mestre de sua própria aventura. Crie sua comunidade e convide seus amigos.</CardDescription>
           <Button disabled>Criar (em breve)</Button>
        </ActionCard>
      </CardsContainer>
    </LobbyContainer>
  );
}

// Estilos
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
  background-color: #2f3136; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid #202225; height: 100%; box-sizing: border-box;
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
  width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #5865f2; color: white; font-weight: bold; cursor: pointer;
  &:disabled { background-color: #40444b; cursor: not-allowed; opacity: 0.7; }
`;

export default Home;