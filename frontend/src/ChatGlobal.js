import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";
const globalPosts = [{ id: 1, author: 'Equipe WorldWeaver', avatar: 'https://i.imgur.com/TUh5Kq8.png', timestamp: '2025-08-03T10:00:00Z', title: '🎉 Bem-vindos ao Mural Global!', content: 'Utilize o chat abaixo para divulgar suas mesas e conversar. Respeitem as regras! Comandos /d20 e /me estão ativos.' }];
const formatDate = (isoString) => new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

function ChatGlobal({ currentUser }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    const roomName = 'global-global';
    socketRef.current.emit('entrar_sala', roomName);

    const messageListener = (message) => {
      if (message.sala === roomName) {
        setChatMessages((prev) => [...prev, message]);
      }
    };
    socketRef.current.on('receber_mensagem', messageListener);

    return () => {
      socketRef.current.off('receber_mensagem', messageListener);
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || !socketRef.current) return;
    let messageData = {};
    if (trimmedMessage.toLowerCase().startsWith('/d')) {
      const sides = parseInt(trimmedMessage.substring(2), 10);
      messageData = { sala: 'global-global', texto: sides > 0 ? `${currentUser.name} rolou um d${sides} e tirou ${Math.floor(Math.random() * sides) + 1}.` : `Comando inválido.`, isSystem: true };
    } else if (trimmedMessage.toLowerCase().startsWith('/me ')) {
      messageData = { sala: 'global-global', texto: `* ${currentUser.name} ${trimmedMessage.substring(4)} *`, isAction: true };
    } else {
      messageData = { sala: 'global-global', remetente: currentUser.name, avatar: currentUser.avatar, texto: trimmedMessage };
    }
    messageData.timestamp = new Date().toISOString();
    socketRef.current.emit('enviar_mensagem', messageData);
    setInputMessage('');
  };

  return (
    <PageContainer>
      <Header><h1>Mural & Chat Global</h1></Header>
      {globalPosts.map((post) => (
        <PostCard key={post.id}><PostHeader><AuthorInfo><Avatar src={post.avatar} /> <AuthorName>{post.author}</AuthorName></AuthorInfo><PostDate>{formatDate(post.timestamp)}</PostDate></PostHeader><PostContent><PostTitle>{post.title}</PostTitle><PostText>{post.content}</PostText></PostContent></PostCard>
      ))}
      <ChatLiveHeader><h3>Chat ao Vivo</h3></ChatLiveHeader>
      <ChatMessages>
        {chatMessages.map((msg, index) => {
          if (msg.isSystem) return <SystemMessage key={index}>{msg.texto}</SystemMessage>;
          if (msg.isAction) return <ActionMessage key={index}>{msg.texto}</ActionMessage>;
          return (<Message key={index} self={msg.remetente === currentUser.name}>{msg.remetente !== currentUser.name && <Avatar src={msg.avatar || "https://via.placeholder.com/40"} />}<MessageContent self={msg.remetente === currentUser.name}><MessageAuthor self={msg.remetente === currentUser.name}>{msg.remetente}</MessageAuthor><MessageText>{msg.texto}</MessageText></MessageContent></Message>);
        })}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInputArea>
        <Input placeholder="Digite uma mensagem ou comando..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
        <SendButton onClick={handleSendMessage}>Enviar</SendButton>
      </ChatInputArea>
    </PageContainer>
  );
}
const PageContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  /* Usa flex-grow para ocupar o espaço disponível no ContentArea do App.js */
  flex-grow: 1; 
  min-height: 0; /* Correção importante para flexbox em containers com scroll */
`;
const Header = styled.header`
  padding: 20px; 
  flex-shrink: 0; 
  h1 { margin: 0; font-size: 1.6em; color: #fff; }
`;
const PostCard = styled.div`
  background-color: #2f3136; 
  margin: 0 20px; 
  border-radius: 8px; 
  flex-shrink: 0;
`;
const PostHeader = styled.div`
  padding: 10px 15px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background-color: #292b2f;
`;
const AuthorInfo = styled.div`
  display: flex; 
  align-items: center; 
  gap: 10px;
`;
const Avatar = styled.img`
  width: 32px; 
  height: 32px; 
  border-radius: 50%;
`;
const AuthorName = styled.span`
  font-weight: bold; 
  color: #fff;
`;
const PostDate = styled.span`
  font-size: 0.8em; 
  color: #8e9297;
`;
const PostContent = styled.div`
  padding: 15px;
`;
const PostTitle = styled.h3`
  font-size: 1.1em; 
  margin: 0 0 10px 0; 
  color: #fff;
`;
const PostText = styled.p`
  margin: 0; 
  font-size: 0.95em; 
  line-height: 1.6; 
  color: #dcddde;
`;
const ChatLiveHeader = styled.div`
  padding: 15px 20px; 
  margin-top: 20px; 
  background-color: #2f3136; 
  border-top: 1px solid #202225; 
  border-bottom: 1px solid #202225; 
  h3 { margin: 0; color: #fff; font-size: 1em; text-transform: uppercase; }
`;
const ChatMessages = styled.div`
  flex-grow: 1; /* Permite que a área de mensagens cresça */
  min-height: 100px; /* Garante uma altura mínima, como recomendado */
  padding: 20px; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
  gap: 15px;
`;
const Message = styled.div`
  display: flex; 
  align-items: flex-start; 
  gap: 10px; 
  ${props => props.self && `justify-content: flex-end;`}
`;
const MessageContent = styled.div`
  background-color: ${props => props.self ? '#5865f2' : '#40444b'}; 
  color: #fff; 
  padding: 10px 15px; 
  border-radius: 8px; 
  max-width: 80%;
`;
const MessageAuthor = styled.div`
  font-weight: bold; 
  margin-bottom: 5px; 
  color: ${props => props.self ? '#fff' : '#5865f2'};
`;
const MessageText = styled.p`
  margin: 0; 
  font-size: 0.95em; 
  line-height: 1.4;
`;
const SystemMessage = styled.div`
  text-align: center; 
  color: #8e9297; 
  font-style: italic; 
  font-size: 0.9em;
`;
const ActionMessage = styled.div`
  color: #b9bbbe; 
  font-style: italic;
`;
const ChatInputArea = styled.div`
  padding: 15px 20px; 
  border-top: 1px solid #202225; 
  display: flex; 
  gap: 10px; 
  flex-shrink: 0; 
  background-color: #2f3136;
`;
const Input = styled.input`
  flex-grow: 1; 
  padding: 10px 15px; 
  border-radius: 8px; 
  border: none; 
  background-color: #40444b; 
  color: #dcddde;
`;
const SendButton = styled.button`
  padding: 10px 20px; 
  border-radius: 8px; 
  border: none; 
  background-color: #5865f2; 
  color: white; 
  cursor: pointer;
`;
export default ChatGlobal;