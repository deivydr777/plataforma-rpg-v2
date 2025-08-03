import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const defaultChannels = [
    { id: 'geral', name: 'geral', type: 'text' },
    { id: 'regras', name: 'regras', type: 'text' },
];

function CommunityViewScreen({ communities }) {
    const { communityId } = useParams();
    const navigate = useNavigate();
    
    const community = communities.find(c => c.id === communityId);

    if (!community) {
        return <ScreenContainer><h1>Carregando...</h1></ScreenContainer>;
    }

    // A FUNÇÃO DE CLIQUE AGORA NAVEGA DE VERDADE
    const handleChannelClick = (channelId) => {
        navigate(`/community/${communityId}/${channelId}`);
    };

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
                    <ChannelItem key={channel.id} onClick={() => handleChannelClick(channel.id)}>
                        <span>#</span> {channel.name}
                    </ChannelItem>
                ))}
            </ChannelList>
        </ScreenContainer>
    );
}

// Estilos (sem alterações)
const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h1 { margin: 0; font-size: 1.6em; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;`;
const SettingsButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;`;
const ChannelList = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;`;
const ChannelItem = styled.div`background-color: #2f3136; border-radius: 5px; padding: 12px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 1.1em; color: #8e9297; span { color: #8e9297; } &:hover { background-color: #40444b; color: #fff; }`;

export default CommunityViewScreen;