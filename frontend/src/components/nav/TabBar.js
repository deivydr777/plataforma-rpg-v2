import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

function TabBar() {
  return (
    <TabBarContainer>
      <TabItem to="/" end> <Icon>🏠</Icon> <Label>Início</Label> </TabItem>
      <TabItem to="/communities"> <Icon>🏰</Icon> <Label>Comunidades</Label> </TabItem>
      <TabItem to="/global"> <Icon>🌍</Icon> <Label>Global</Label> </TabItem>
      <TabItem to="/profile"> <Icon>👤</Icon> <Label>Perfil</Label> </TabItem>
    </TabBarContainer>
  );
}

const TabBarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 65px; 
  background-color: #202225;
  border-top: 1px solid #000;
  
  /* NÃO É MAIS 'position: fixed'. Ele agora faz parte do fluxo normal */
  width: 100%;
  flex-shrink: 0; /* Impede que a TabBar encolha */
`;

const TabItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: #8e9297;
  text-decoration: none;
  height: 100%;
  padding: 5px 0;

  &.active {
    color: #ffffff;
  }
`;

const Icon = styled.span`
  font-size: 28px; 
`;

const Label = styled.span`
  font-size: 12px; 
  font-weight: 500;
  margin-top: 4px;
`;

export default TabBar;