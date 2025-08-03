import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

function ChatCommunityScreen({ communities, currentUser }) {
    const { communityId, channelId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const community = communities.find(c => c.id === communityId);
    
    useEffect(() => {
        const roomName = `${communityId}-${channelId}`;
        socketRef.current = io(SOCKET_SERVER_URL);
        socketRef.current.emit('entrar_sala', roomName);

        const messageListener = (message) => {
            if (message.sala === roomName) {
                setMessages(prev => [...prev, message]);
            }
        };
        socketRef.current.on('receber_mensagem', messageListener);

        return () => {
            socketRef.current.off('receber_mensagem', messageListener);
            socketRef.current.disconnect();
        };
    }, [communityId, channelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        const trimmedMessage = inputMessage.trim();
        if (!trimmedMessage || !socketRef.current) return;
        const messageData = { sala: `${communityId}-${channelId}`, remetente: currentUser.name, avatar: currentUser.avatar, texto: trimmedMessage, timestamp: new Date().toISOString() };
        socketRef.current.emit('enviar_mensagem', messageData);
        setInputMessage('');
    };
    
    if (!community) return <PageContainer><h1>Carregando Comunidade...</h1></PageContainer>;

    return (
        <PageContainer>
            <Header>
                <BackButton onClick={() => navigate(`/community/${communityId}`)}>←</BackButton>
                <h2># {channelId}</h2>
            </Header>
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
                <Input placeholder={`Mensagem em #${channelId}`} value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                <SendButton onClick={handleSendMessage}>Enviar</SendButton>
            </ChatInputArea>
        </PageContainer>
    );
}

const PageContainer = styled.div`display: flex; flex-direction: column; height: 100%;`;
const Header = styled.header`display: flex; align-items: center; gap: 15px; padding: 15px 20px; background-color: #2f3136; flex-shrink: 0; h2 { margin: 0; font-size: 1.2em; color: #fff; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;`;
const ChatMessages = styled.div`flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;`;
const Message = styled.div`display: flex; align-items: flex-start; gap: 10px; ${props => props.self && `justify-content: flex-end;`}`;
const Avatar = styled.img`width: 40px; height: 40px; border-radius: 50%;`;
const MessageContent = styled.div`background-color: ${props => props.self ? '#5865f2' : '#40444b'}; color: #fff; padding: 10px 15px; border-radius: 8px; max-width: 80%;`;
const MessageAuthor = styled.div`font-weight: bold; margin-bottom: 5px; color: ${props => props.self ? '#fff' : '#5865f2'};`;
const MessageText = styled.p`margin: 0; font-size: 0.95em; line-height: 1.4;`;
const ChatInputArea = styled.div`padding: 15px 20px; border-top: 1px solid #202225; display: flex; gap: 10px; flex-shrink: 0; background-color: #2f3136;`;
const Input = styled.input`flex-grow: 1; padding: 10px 15px; border-radius: 8px; border: none; background-color: #40444b; color: #dcddde;`;
const SendButton = styled.button`padding: 10px 20px; border-radius: 8px; border: none; background-color: #5865f2; color: white; cursor: pointer;`;

export default ChatCommunityScreen;