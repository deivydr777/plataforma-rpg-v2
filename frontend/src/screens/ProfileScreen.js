import React from 'react';
import styled from 'styled-components';

function ProfileScreen({ currentUser }) {
  return (
    <ScreenContainer>
      <Header><h1>Seu Perfil</h1></Header>
      <ProfileCard>
        <Avatar src={currentUser.avatar} alt="Avatar do usuário" />
        <UserName>{currentUser.name}</UserName>
        <Button>Sair (em breve)</Button>
      </ProfileCard>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.div`margin-bottom: 30px; h1 { margin: 0; font-size: 1.8em; }`;
const ProfileCard = styled.div`background-color: #2f3136; border-radius: 8px; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 20px;`;
const Avatar = styled.img`width: 100px; height: 100px; border-radius: 50%;`;
const UserName = styled.h2`margin: 0; font-size: 1.5em; color: #fff;`;
const Button = styled.button`width: 100%; max-width: 200px; padding: 12px; border-radius: 5px; border: none; background-color: #d9534f; color: white; font-weight: bold; cursor: pointer;`;

export default ProfileScreen;