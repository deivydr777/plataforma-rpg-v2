import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

// DADOS FALSOS PARA O MURAL FIXO
const globalPosts = [
  { id: 1, author: 'Equipe Pandão', avatar: 'https://i.imgur.com/TUh5Kq8.png', timestamp: '2025-08-01T10:00:00Z', title: '🎉 Bem-vindos à Plataforma RPG!', content: 'Utilize o chat abaixo para divulgar suas mesas, encontrar jogadores e tirar dúvidas. Respeitem as regras da comunidade. Rolagens de dados e ações com /d e /me também funcionam aqui!' },
  { id: 2, author: 'Equipe Pandão', avatar: 'https://i.imgur.com/TUh5Kq8.png', timestamp: '2025-08-02T14:30:00Z', title: '📢 Funcionalidade de Convites em Breve', content: 'Estamos trabalhando duro na funcionalidade de links de convite para as comunidades. Em breve, os donos de comunidades poderão gerar links para convidar seus amigos.' }
];

const formatDate = (isoString) => new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

function ChatGlobal({ currentUser, toggleCommunitiesSidebar, toggleChannelsSidebar }) {
  // Estado para as mensagens do chat em tempo real
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // --- LÓGICA DO SOCKET CORRIGIDA ---
  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);
    const roomName = 'global-global';

    socket.current.emit('entrar_sala', roomName);
    console.log(`Entrando na sala: ${roomName}`);

    const messageListener = (message) => {
      // Adiciona apenas mensagens da sala correta
      if (message.sala === roomName) {
        setChatMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    socket.current.on('receber_mensagem', messageListener);

    // FUNÇÃO DE LIMPEZA - Essencial para evitar mensagens duplicadas
    return () => {
      console.log("Saindo do Chat Global, limpando socket.");
      socket.current.off('receber_mensagem', messageListener);
      socket.current.disconnect();
    };
  }, []); // Array vazio, roda apenas uma vez

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || !socket.current) return;

    let messageData = {};

    if (trimmedMessage.toLowerCase().startsWith('/d')) {
      const sides = parseInt(trimmedMessage.substring(2), 10);
      messageData = {
        sala: 'global-global',
        texto: sides > 0 ? `${currentUser.name} rolou um d${sides} e tirou ${Math.floor(Math.random() * sides) + 1}.` : `Comando inválido.`,
        isSystem: true,
      };
    } else if (trimmedMessage.toLowerCase().startsWith('/me ')) {
      messageData = {
        sala: 'global-global',
        texto: `* ${currentUser.name} ${trimmedMessage.substring(4)} *`,
        isAction: true,
      };
    } else {
      messageData = {
        sala: 'global-global',
        remetente: currentUser.name,
        avatar: currentUser.avatar,
        texto: trimmedMessage,
      };
    }

    messageData.timestamp = new Date().toISOString();
    socket.current.emit('enviar_mensagem', messageData);
    setInputMessage('');
  };

  return (
    <MuralArea>
      <MobileHeader>
        <MenuButton onClick={toggleCommunitiesSidebar}>☰</MenuButton>
        <MobileTitle>🌍 Mural & Chat Global</MobileTitle>
      </MobileHeader>
      
      <MuralHeader>
        <h2>🌍 Mural Global</h2>
        <p>Avisos importantes da Equipe Pandão.</p>
      </MuralHeader>
      
      <PostsContainer>
        {globalPosts.map((post) => (
          <PostCard key={post.id}>
            <PostHeader>
              <AuthorInfo><Avatar src={post.avatar} /> <AuthorName>{post.author}</AuthorName></AuthorInfo>
              <PostDate>{formatDate(post.timestamp)}</PostDate>
            </PostHeader>
            <PostContent>
              <PostTitle>{post.title}</PostTitle>
              <PostText>{post.content}</PostText>
            </PostContent>
          </PostCard>
        ))}
      </PostsContainer>

      <ChatLiveHeader>
        <h3>Chat ao Vivo</h3>
      </ChatLiveHeader>

      <ChatMessages>
        {chatMessages.map((msg, index) => {
            if (msg.isSystem) return <SystemMessage key={index}>{msg.texto}</SystemMessage>;
            if (msg.isAction) return <ActionMessage key={index}>{msg.texto}</ActionMessage>;
            return (
                <Message key={index} self={msg.remetente === currentUser.name}>
                    {msg.remetente !== currentUser.name && <Avatar src={msg.avatar || "https://via.placeholder.com/40"} />}
                    <MessageContent self={msg.remetente === currentUser.name}>
                      <MessageAuthor self={msg.remetente === currentUser.name}>{msg.remetente}</MessageAuthor>
                      <MessageText>{msg.texto}</MessageText>
                    </MessageContent>
                </Message>
            );
        })}
        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInputArea>
        <Input 
          placeholder="Digite uma mensagem ou comando..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <SendButton onClick={handleSendMessage}>Enviar</SendButton>
      </ChatInputArea>
    </MuralArea>
  );
}

// --- Estilos ---

const MuralArea = styled.div`
  flex-grow: 1; display: flex; flex-direction: column; background-color: #36393f; overflow-y: hidden;
`;
const MuralHeader = styled.div`
  padding: 20px 30px; border-bottom: 1px solid #202225; background-color: #2f3136; flex-shrink: 0;
  h2 { font-size: 1.5em; margin: 0 0 5px 0; color: #ffffff; }
  p { margin: 0; color: #b9bbbe; }
`;
const PostsContainer = styled.div`
  padding: 20px 30px; display: flex; flex-direction: column; gap: 15px; flex-shrink: 0;
`;
const PostCard = styled.div`
  background-color: #2f3136; border-radius: 8px; border: 1px solid #202225;
`;
const PostHeader = styled.div`
  padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; background-color: #292b2f;
`;
const AuthorInfo = styled.div`
  display: flex; align-items: center; gap: 10px;
`;
const Avatar = styled.img`
  width: 32px; height: 32px; border-radius: 50%;
`;
const AuthorName = styled.span`
  font-weight: bold; color: #ffffff;
`;
const PostDate = styled.span`
  font-size: 0.8em; color: #8e9297;
`;
const PostContent = styled.div`
  padding: 15px;
`;
const PostTitle = styled.h3`
  font-size: 1.1em; margin: 0 0 10px 0; color: #ffffff;
`;
const PostText = styled.p`
  margin: 0; font-size: 0.95em; line-height: 1.6; color: #dcddde;
`;
const ChatLiveHeader = styled.div`
  padding: 10px 30px; background-color: #2f3136; border-top: 1px solid #202225; border-bottom: 1px solid #202225;
  h3 { margin: 0; color: #ffffff; font-size: 1em; text-transform: uppercase; letter-spacing: 0.5px; }
`;
const ChatMessages = styled.div`
  flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;
`;
const Message = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  ${props => props.self && `justify-content: flex-end;`}
`;
const MessageContent = styled.div`
  background-color: ${props => props.self ? '#5865f2' : '#40444b'};
  color: #ffffff; padding: 10px 15px; border-radius: 8px; max-width: 70%;
`;
const MessageAuthor = styled.div`
  font-weight: bold; margin-bottom: 5px; color: ${props => props.self ? '#ffffff' : '#5865f2'};
`;
const MessageText = styled.p`
  margin: 0; font-size: 0.95em; line-height: 1.4;
`;
const SystemMessage = styled.div`
  text-align: center; color: #8e9297; font-style: italic; font-size: 0.9em;
`;
const ActionMessage = styled.div`
  color: #b9bbbe; font-style: italic;
`;
const ChatInputArea = styled.div`
  padding: 15px 20px; border-top: 1px solid #202225; display: flex; gap: 10px; flex-shrink: 0;
`;
const Input = styled.input`
  flex-grow: 1; padding: 10px 15px; border-radius: 8px; border: none; background-color: #40444b; color: #dcddde;
`;
const SendButton = styled.button`
  padding: 10px 20px; border-radius: 8px; border: none; background-color: #5865f2; color: white; cursor: pointer;
`;
const MobileHeader = styled.div`
  display: none; @media (max-width: 768px) { display: flex; justify-content: space-between; align-items: center; padding: 0 10px; background-color: #202225; height: 48px; flex-shrink: 0; }
`;
const MobileTitle = styled.h2`
  font-size: 1.1em; margin: 0; color: #dcddde;
`;
const MenuButton = styled.button`
  background: none; border: none; color: #dcddde; font-size: 1.5em; cursor: pointer;
`;

export default ChatGlobal;