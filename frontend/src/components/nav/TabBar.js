import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

function TabBar() {
  return (
    <TabBarContainer>
      <TabItem to="/" end>
        <Icon>🏠</Icon>
        <Label>Início</Label>
      </TabItem>
      <TabItem to="/communities">
        <Icon>🏰</Icon>
        <Label>Comunidades</Label>
      </TabItem>
      <TabItem to="/global">
        <Icon>🌍</Icon>
        <Label>Global</Label>
      </TabItem>
      <TabItem to="/profile">
        <Icon>👤</Icon>
        <Label>Perfil</Label>
      </TabItem>
    </TabBarContainer>
  );
}

// --- ESTILOS CORRIGIDOS E AUMENTADOS ---

const TabBarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* Aumentamos a altura para dar mais espaço */
  height: 65px; 
  background-color: #202225;
  border-top: 1px solid #000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
  padding: 5px 0; /* Adiciona um pouco de padding vertical */

  &.active {
    color: #ffffff; /* Cor branca para mais destaque */
    background-color: #3d424a; /* Um fundo sutil para o item ativo */
  }
`;

const Icon = styled.span`
  /* Ícone significativamente maior */
  font-size: 28px; 
`;

const Label = styled.span`
  /* Fonte maior e com mais peso */
  font-size: 12px; 
  font-weight: 500;
  margin-top: 4px;
`;

export default TabBar;