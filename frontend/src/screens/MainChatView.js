import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

// Função para buscar dados da comunidade (simulado)
const getCommunityData = (id, communities) => {
    return communities.find(c => c.id === id);
};

function MainChatView({ currentUser, communities }) {
    const { communityId, channelId } = useParams();
    const navigate = useNavigate();

    const community = getCommunityData(communityId, communities);
    const [activeChannelId, setActiveChannelId] = useState(channelId);
    
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Redireciona para o primeiro canal se nenhum for especificado
    useEffect(() => {
        if (community && !channelId) {
            const firstTextChannel = community.channels.find(c => c.type === 'text');
            if (firstTextChannel) {
                navigate(`/community/${community.id}/${firstTextChannel.id}`, { replace: true });
            }
        }
    }, [community, channelId, navigate]);

    // Conecta ao socket do canal
    useEffect(() => {
        if (!communityId || !activeChannelId) return;

        // Limpa mensagens ao trocar de canal
        setMessages([]);

        socketRef.current = io(SOCKET_SERVER_URL);
        const roomName = `${communityId}-${activeChannelId}`;
        socketRef.current.emit('entrar_sala', roomName);

        const messageListener = (message) => {
            setMessages((prev) => [...prev, message]);
        };
        socketRef.current.on('receber_mensagem', messageListener);

        return () => {
            socketRef.current.off('receber_mensagem', messageListener);
            socketRef.current.disconnect();
        };
    }, [communityId, activeChannelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => { /* Implementar lógica de envio */ };

    if (!community) {
        return <LoadingScreen>Carregando...</LoadingScreen>;
    }

    return (
        <Layout>
            <ChannelsSidebar>
                <CommunityHeader>{community.name}</CommunityHeader>
                <ChannelList>
                    <ChannelCategory>Canais de Texto</ChannelCategory>
                    {community.channels.filter(c => c.type === 'text').map(ch => (
                        <ChannelItem 
                            key={ch.id} 
                            active={ch.id === activeChannelId}
                            onClick={() => {
                                setActiveChannelId(ch.id);
                                navigate(`/community/${community.id}/${ch.id}`);
                            }}
                        >
                            # {ch.name}
                        </ChannelItem>
                    ))}
                </ChannelList>
            </ChannelsSidebar>
            <ChatContainer>
                <ChatHeader>
                    <BackButton onClick={() => navigate('/communities')}>←</BackButton>
                    <h2># {activeChannelId}</h2>
                </ChatHeader>
                <ChatMessages>
                    {/* Mensagens irão aqui */}
                    <div ref={messagesEndRef} />
                </ChatMessages>
                <ChatInputArea>
                    <Input placeholder={`Conversar em #${activeChannelId}`} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                </ChatInputArea>
            </ChatContainer>
        </Layout>
    );
}

const Layout = styled.div`display: flex; height: 100%; width: 100%;`;
const ChannelsSidebar = styled.div`width: 240px; background-color: #2f3136; flex-shrink: 0; display: flex; flex-direction: column;`;
const CommunityHeader = styled.div`padding: 20px; font-size: 1.2em; font-weight: bold; color: #fff; border-bottom: 1px solid #202225;`;
const ChannelList = styled.div`padding: 10px; overflow-y: auto;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin: 15px 0 5px 10px; text-transform: uppercase;`;
const ChannelItem = styled.div`padding: 10px; border-radius: 5px; color: ${props => props.active ? '#fff' : '#8e9297'}; background-color: ${props => props.active ? '#40444b' : 'transparent'}; cursor: pointer; &:hover { background-color: #3a3c42; }`;
const ChatContainer = styled.div`flex-grow: 1; display: flex; flex-direction: column;`;
const ChatHeader = styled.div`padding: 0 20px; height: 60px; display: flex; align-items: center; border-bottom: 1px solid #2f3136; color: #fff; h2 { margin: 0; font-size: 1.2em; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; margin-right: 15px;`;
const ChatMessages = styled.div`flex-grow: 1; padding: 20px; overflow-y: auto;`;
const ChatInputArea = styled.div`padding: 20px;`;
const Input = styled.input`width: 100%; padding: 12px; border: none; border-radius: 8px; background-color: #40444b; color: #dcddde;`;
const LoadingScreen = styled.div`display: flex; align-items: center; justify-content: center; height: 100%; color: #fff;`;

export default MainChatView;