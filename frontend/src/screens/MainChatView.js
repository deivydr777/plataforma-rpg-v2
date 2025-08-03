import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

const getCommunityData = (id) => {
    const savedCommunities = localStorage.getItem('communities');
    if (!savedCommunities) return null;
    const communities = JSON.parse(savedCommunities);
    return communities.find(c => c.id === id);
};

function MainChatView({ currentUser }) {
    const { communityId, channelId } = useParams();
    const navigate = useNavigate();
    
    // AQUI ESTÁ A CORREÇÃO PRINCIPAL
    // 'community' agora é um estado normal, que será atualizado pelo useEffect.
    const [community, setCommunity] = useState(null);
    
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // ESTE USEEFFECT GARANTE QUE A COMUNIDADE É RECARREGADA QUANDO A URL MUDA
    useEffect(() => {
        const data = getCommunityData(communityId);
        setCommunity(data);
    }, [communityId]); // Roda toda vez que o communityId da URL muda

    // Redireciona para o primeiro canal se nenhum for especificado
    useEffect(() => {
        if (community && !channelId) {
            const firstTextChannel = community.channels.find(c => c.type === 'text');
            if (firstTextChannel) {
                navigate(`/community/${community.id}/${firstTextChannel.id}`, { replace: true });
            }
        }
    }, [community, channelId, navigate]);

    // Lógica do Socket.IO (sem mudanças)
    useEffect(() => {
        if (!communityId || !channelId) return;
        setMessages([]);
        socketRef.current = io(SOCKET_SERVER_URL);
        const roomName = `${communityId}-${channelId}`;
        socketRef.current.emit('entrar_sala', roomName);
        const messageListener = (message) => setMessages((prev) => [...prev, message]);
        socketRef.current.on('receber_mensagem', messageListener);
        return () => {
            socketRef.current.off('receber_mensagem', messageListener);
            socketRef.current.disconnect();
        };
    }, [communityId, channelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => { /* ... lógica de envio ... */ };

    if (!community) {
        return (
            <LoadingScreen>
                <h2>Carregando comunidade...</h2>
                <Button onClick={() => navigate('/communities')}>Voltar</Button>
            </LoadingScreen>
        );
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
                            active={ch.id === channelId}
                            onClick={() => navigate(`/community/${community.id}/${ch.id}`)}
                        >
                            # {ch.name}
                        </ChannelItem>
                    ))}
                </ChannelList>
            </ChannelsSidebar>
            <ChatContainer>
                <ChatHeader>
                    <BackButton onClick={() => navigate('/communities')}>←</BackButton>
                    <h2># {channelId || 'Selecione um canal'}</h2>
                </ChatHeader>
                <ChatMessages>
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
const ChannelsSidebar = styled.div`width: 240px; background-color: #2f3136; flex-shrink: 0; display: flex; flex-direction: column; @media (max-width: 768px) { width: 100%; }`;
const CommunityHeader = styled.div`padding: 20px; font-size: 1.2em; font-weight: bold; color: #fff; border-bottom: 1px solid #202225;`;
const ChannelList = styled.div`padding: 10px; overflow-y: auto;`;
const ChannelCategory = styled.div`font-size: 0.8em; color: #8e9297; margin: 15px 0 5px 10px; text-transform: uppercase;`;
const ChannelItem = styled.div`padding: 10px; border-radius: 5px; color: ${props => props.active ? '#fff' : '#8e9297'}; background-color: ${props => props.active ? '#40444b' : 'transparent'}; cursor: pointer; &:hover { background-color: #3a3c42; }`;
const ChatContainer = styled.div`flex-grow: 1; display: flex; flex-direction: column; @media (max-width: 768px) { display: none; }`;
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
const LoadingScreen = styled.div`display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #fff; text-align: center; padding: 20px;`;
const Button = styled.button`padding: 12px 20px; border-radius: 5px; border: none; background-color: #5865f2; color: white; font-weight: bold; cursor: pointer; margin-top: 20px;`;

export default MainChatView;