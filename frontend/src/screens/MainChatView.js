import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";
const getCommunityData = (id) => { /* ... (código igual) ... */ };

function MainChatView({ currentUser, communities }) {
    const { communityId, channelId } = useParams();
    const navigate = useNavigate();
    const community = getCommunityData(communityId, communities);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // VERIFICAÇÃO DE SEGURANÇA: Só redireciona se a comunidade e os canais existirem
        if (community && community.channels && !channelId) {
            const firstTextChannel = community.channels.find(c => c.type === 'text');
            if (firstTextChannel) {
                navigate(`/community/${community.id}/${firstTextChannel.id}`, { replace: true });
            }
        }
    }, [community, channelId, navigate]);

    useEffect(() => {
        if (!communityId || !channelId) return;
        setMessages([]);
        socketRef.current = io(SOCKET_SERVER_URL);
        const roomName = `${communityId}-${channelId}`;
        socketRef.current.emit('entrar_sala', roomName);
        const listener = (msg) => setMessages(prev => [...prev, msg]);
        socketRef.current.on('receber_mensagem', listener);
        return () => {
            socketRef.current.off('receber_mensagem', listener);
            socketRef.current.disconnect();
        };
    }, [communityId, channelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        const trimmed = inputMessage.trim();
        if (trimmed && socketRef.current) {
            const msgData = { sala: `${communityId}-${channelId}`, remetente: currentUser.name, avatar: currentUser.avatar, texto: trimmed, timestamp: new Date().toISOString() };
            socketRef.current.emit('enviar_mensagem', msgData);
            setInputMessage('');
        }
    };

    if (!community) { return <LoadingScreen>Carregando...</LoadingScreen>; }

    return (
        <Layout>
            <ChannelsSidebar>
                <CommunityHeader>{community.name}</CommunityHeader>
                <ChannelList>
                    <ChannelCategory>Canais de Texto</ChannelCategory>
                    {/* VERIFICAÇÃO DE SEGURANÇA: Só mostra se 'channels' existir */}
                    {community.channels && community.channels.filter(c => c.type === 'text').map(ch => (
                        <ChannelItem key={ch.id} active={ch.id === channelId} onClick={() => navigate(`/community/${community.id}/${ch.id}`)}>
                            # {ch.name}
                        </ChannelItem>
                    ))}
                </ChannelList>
            </ChannelsSidebar>
            <ChatContainer>
                <ChatHeader>
                    <BackButton onClick={() => navigate('/communities')}>←</BackButton>
                    <h2># {channelId}</h2>
                </ChatHeader>
                <ChatMessages>
                    {/* LÓGICA DE MENSAGENS IMPLEMENTADA */}
                    {messages.map((msg, index) => (
                        <Message key={index} self={msg.remetente === currentUser.name}>
                            {msg.remetente !== currentUser.name && <Avatar src={msg.avatar || "https://via.placeholder.com/40"} />}
                            <MessageContent self={msg.remetente === currentUser.name}>
                              <MessageAuthor self={msg.remetente === currentUser.name}>{msg.remetente}</MessageAuthor>
                              <MessageText>{msg.texto}</MessageText>
                            </MessageContent>
                        </Message>
                    ))}
                    <div ref={messagesEndRef} />
                </ChatMessages>
                <ChatInputArea>
                    <Input placeholder={`Conversar em #${channelId}`} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <SendButton onClick={handleSendMessage}>Enviar</SendButton>
                </ChatInputArea>
            </ChatContainer>
        </Layout>
    );
}

// Estilos
const Layout = styled.div`display: flex; height: 100%; width: 100%;`;
const ChannelsSidebar = styled.div`width: 240px; background-color: #2f3136; flex-shrink: 0; display: flex; flex-direction: column;`;
const CommunityHeader = styled.div`padding: 20px; font-size: 1.2em; font-weight: bold; color: #fff; border-bottom: 1px solid #202225;`;
const ChannelList = styled.div`padding: 10px; overflow-y: auto;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin: 15px 0 5px 10px; text-transform: uppercase;`;
const ChannelItem = styled.div`padding: 10px; border-radius: 5px; color: ${props => props.active ? '#fff' : '#8e9297'}; background-color: ${props => props.active ? '#40444b' : 'transparent'}; cursor: pointer; &:hover { background-color: #3a3c42; }`;
const ChatContainer = styled.div`flex-grow: 1; display: flex; flex-direction: column;`;
const ChatHeader = styled.div`padding: 0 20px; height: 60px; display: flex; align-items: center; border-bottom: 1px solid #2f3136; color: #fff; h2 { margin: 0; font-size: 1.2em; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; margin-right: 15px;`;
const ChatMessages = styled.div`flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;`;
const Message = styled.div`display: flex; align-items: flex-start; gap: 10px; ${props => props.self && `justify-content: flex-end;`}`;
const Avatar = styled.img`width: 40px; height: 40px; border-radius: 50%;`;
const MessageContent = styled.div`background-color: ${props => props.self ? '#5865f2' : '#40444b'}; color: #fff; padding: 10px 15px; border-radius: 8px; max-width: 80%;`;
const MessageAuthor = styled.div`font-weight: bold; margin-bottom: 5px; color: ${props => props.self ? '#fff' : '#5865f2'};`;
const MessageText = styled.p`margin: 0; font-size: 0.95em; line-height: 1.4;`;
const ChatInputArea = styled.div`padding: 20px; display: flex; gap: 10px;`;
const Input = styled.input`flex-grow: 1; padding: 12px; border: none; border-radius: 8px; background-color: #40444b; color: #dcddde;`;
const SendButton = styled.button`padding: 0 20px; border: none; border-radius: 8px; background-color: #5865f2; color: #fff; cursor: pointer;`;
const LoadingScreen = styled.div`display: flex; align-items: center; justify-content: center; height: 100%; color: #fff;`;

export default MainChatView;