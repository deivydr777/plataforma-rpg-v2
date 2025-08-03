import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

// DADOS FALSOS PARA A COMUNIDADE
// No futuro, isso virá do backend com base no communityId
const getCurrentCommunityData = (communityId) => {
    // Apenas um exemplo
    if (communityId === '1') { // Supondo que o ID da "Oi" seja '1'
        return {
            id: '1',
            name: 'Oi',
            icon: '⚔️',
            channels: [
                { id: 'geral', name: 'geral', type: 'text' },
                { id: 'regras', name: 'regras', type: 'text' },
                { id: 'comandos', name: 'comandos', type: 'text' },
                { id: 'voz-1', name: 'Sala de Voz 1', type: 'voice' },
            ]
        };
    }
    return null; // Comunidade não encontrada
};


function MainChatView({ currentUser }) {
    const { communityId, channelId } = useParams();
    const navigate = useNavigate();

    const [community, setCommunity] = useState(null);
    const [activeChannel, setActiveChannel] = useState(channelId);
    
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Carrega os dados da comunidade e define o canal ativo
    useEffect(() => {
        const communityData = getCurrentCommunityData(communityId);
        setCommunity(communityData);

        if (communityData) {
            // Se nenhum canal for especificado na URL, entra no primeiro
            const initialChannel = channelId || communityData.channels.find(c => c.type === 'text')?.id;
            if (initialChannel && initialChannel !== activeChannel) {
                setActiveChannel(initialChannel);
                // Atualiza a URL sem recarregar a página
                navigate(`/community/${communityId}/${initialChannel}`, { replace: true });
            }
        }
    }, [communityId, channelId, navigate, activeChannel]);


    // Lógica do Socket.IO para o chat
    useEffect(() => {
        if (!activeChannel) return;

        socketRef.current = io(SOCKET_SERVER_URL);
        const roomName = `${communityId}-${activeChannel}`;
        socketRef.current.emit('entrar_sala', roomName);

        const messageListener = (message) => {
            setMessages((prev) => [...prev, message]);
        };
        socketRef.current.on('receber_mensagem', messageListener);

        return () => {
            socketRef.current.off('receber_mensagem', messageListener);
            socketRef.current.disconnect();
        };
    }, [communityId, activeChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => { /* ... Lógica de envio de mensagem ... */ };

    if (!community) {
        return <LoadingScreen>Carregando comunidade...</LoadingScreen>;
    }

    return (
        <Layout>
            {/* Coluna 2: Lista de Canais */}
            <ChannelsSidebar>
                <CommunityHeader>{community.name}</CommunityHeader>
                <ChannelList>
                    <ChannelCategory>Canais de Texto</ChannelCategory>
                    {community.channels.filter(c => c.type === 'text').map(channel => (
                        <ChannelItem 
                            key={channel.id} 
                            active={channel.id === activeChannel}
                            onClick={() => navigate(`/community/${communityId}/${channel.id}`)}
                        >
                            # {channel.name}
                        </ChannelItem>
                    ))}
                     <ChannelCategory>Canais de Voz</ChannelCategory>
                    {community.channels.filter(c => c.type === 'voice').map(channel => (
                        <ChannelItem key={channel.id}>
                            🔊 {channel.name}
                        </ChannelItem>
                    ))}
                </ChannelList>
            </ChannelsSidebar>

            {/* Coluna 3: Chat Ativo */}
            <ChatContainer>
                <ChatHeader># {activeChannel}</ChatHeader>
                <ChatMessages>
                    {/* ... Mapeamento de mensagens ... */}
                    <div ref={messagesEndRef} />
                </ChatMessages>
                <ChatInputArea>
                    <Input placeholder={`Conversar em #${activeChannel}`} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <SendButton onClick={handleSendMessage}>Enviar</SendButton>
                </ChatInputArea>
            </ChatContainer>
        </Layout>
    );
}


// --- Estilos ---
const Layout = styled.div`display: flex; height: 100%;`;
const ChannelsSidebar = styled.div`width: 240px; background-color: #2f3136; flex-shrink: 0; display: flex; flex-direction: column;`;
const CommunityHeader = styled.div`padding: 20px; font-size: 1.2em; font-weight: bold; color: #fff; border-bottom: 1px solid #202225;`;
const ChannelList = styled.div`padding: 10px; overflow-y: auto;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin: 15px 0 5px 10px; text-transform: uppercase;`;
const ChannelItem = styled.div`padding: 10px; border-radius: 5px; color: ${props => props.active ? '#fff' : '#8e9297'}; background-color: ${props => props.active ? '#40444b' : 'transparent'}; cursor: pointer; &:hover { background-color: #3a3c42; }`;
const ChatContainer = styled.div`flex-grow: 1; display: flex; flex-direction: column;`;
const ChatHeader = styled.div`padding: 0 20px; height: 60px; display: flex; align-items: center; border-bottom: 1px solid #2f3136; font-size: 1.2em; font-weight: bold; color: #fff;`;
const ChatMessages = styled.div`flex-grow: 1; padding: 20px; overflow-y: auto;`;
const ChatInputArea = styled.div`padding: 20px; display: flex; gap: 10px;`;
const Input = styled.input`flex-grow: 1; padding: 12px; border: none; border-radius: 8px; background-color: #40444b; color: #dcddde;`;
const SendButton = styled.button`padding: 0 20px; border: none; border-radius: 8px; background-color: #5865f2; color: #fff; cursor: pointer;`;
const LoadingScreen = styled.div`display: flex; align-items: center; justify-content: center; height: 100%; color: #fff;`;

export default MainChatView;