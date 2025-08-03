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
        <Label>Chat Global</Label>
      </TabItem>
      <TabItem to="/profile">
        <Icon>👤</Icon>
        <Label>Perfil</Label>
      </TabItem>
    </TabBarContainer>
  );
}

const TabBarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
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

  &.active {
    color: #fff;
    background-color: #36393f;
  }
`;
const Icon = styled.span`
  font-size: 24px;
`;
const Label = styled.span`
  font-size: 10px;
  margin-top: 2px;
`;

export default TabBar;