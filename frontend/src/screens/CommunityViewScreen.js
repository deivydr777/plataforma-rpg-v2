import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const defaultChannels = [
    { id: 'geral', name: 'geral', type: 'text' },
    { id: 'regras', name: 'regras', type: 'text' },
];

function CommunityViewScreen() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook para pegar o state
    
    // Pega os dados da comunidade que foram passados durante a navegação
    const community = location.state?.community;

    if (!community) {
        return (
            <ScreenContainer>
                <h1>Comunidade não encontrada!</h1>
                <Button onClick={() => navigate('/communities')}>Voltar</Button>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <Header>
                <BackButton onClick={() => navigate('/communities')}>←</BackButton>
                <h1>{community.icon} {community.name}</h1>
                <SettingsButton>⚙️</SettingsButton>
            </Header>
            <ChannelList>
                <ChannelCategory>CANAIS DE TEXTO</ChannelCategory>
                {defaultChannels.map(channel => (
                    <ChannelItem key={channel.id}>
                        <span>#</span> {channel.name}
                    </ChannelItem>
                ))}
            </ChannelList>
        </ScreenContainer>
    );
}

// Estilos (sem mudanças)
const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h1 { margin: 0; font-size: 1.6em; color: #fff; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;`;
const SettingsButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;`;
const ChannelList = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; padding: 0 10px;`;
const ChannelItem = styled.div`background-color: #2f3136; border-radius: 5px; padding: 12px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 1.1em; color: #b9bbbe; span { color: #8e9297; } &:hover { background-color: #40444b; color: #fff; }`;
const Button = styled.button`padding: 12px; border-radius: 5px; border: none; background-color: #5865f2; color: white; font-weight: bold; cursor: pointer;`;

export default CommunityViewScreen;