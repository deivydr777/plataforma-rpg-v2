import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

function ChatGlobal({ currentUser, toggleCommunitiesSidebar, toggleChannelsSidebar }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // --- INÍCIO DA MUDANÇA ---
  // Unificamos a lógica do socket em um único useEffect.
  useEffect(() => {
    // 1. Conecta ao socket
    socket.current = io(SOCKET_SERVER_URL);

    // 2. Define o ouvinte para receber mensagens
    const messageListener = (message) => {
      // Garante que só mensagens da sala global sejam adicionadas
      if (message.sala === 'global-global') {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    socket.current.on('receber_mensagem', messageListener);

    // 3. Entra na sala global
    const roomName = 'global-global';
    socket.current.emit('entrar_sala', roomName);
    console.log(`Entrando na sala global: ${roomName}`);
    
    // 4. A FUNÇÃO DE LIMPEZA
    // Será executada quando o usuário sair do Chat Global.
    return () => {
      console.log("Limpando socket do Chat Global.");
      socket.current.off('receber_mensagem', messageListener);
      socket.current.disconnect();
    };
    
  // A array de dependências vazia `[]` faz com que este useEffect rode
  // apenas uma vez: quando o componente ChatGlobal é montado.
  }, []);
  // --- FIM DA MUDANÇA ---

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket.current) {
      const messageData = {
        sala: 'global-global',
        remetente: currentUser.name,
        avatar: currentUser.avatar,
        texto: inputMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      
      socket.current.emit('enviar_mensagem', messageData);
      
      // Otimização otimista: adiciona a mensagem localmente.
      setMessages((prevMessages) => [...prevMessages, messageData]);
      
      setInputMessage('');
    }
  };

  // ... O resto do seu código (return com JSX e Estilos) continua exatamente o mesmo ...
  return (
    <ChatArea>
      <MobileHeader>
        <MenuButton onClick={toggleCommunitiesSidebar}>☰</MenuButton>
        <MobileTitle>🌍 Chat Global</MobileTitle>
        <MenuButton onClick={toggleChannelsSidebar}>Canais</MenuButton>
      </MobileHeader>
      <ChatHeader>
        <h2>🌍 Chat Global</h2>
      </ChatHeader>
      <ChatMessages>
        {messages.map((msg, index) => (
          <Message key={index} self={msg.remetente === currentUser.name}>
            {msg.remetente !== currentUser.name && <Avatar src={msg.avatar || "https://via.placeholder.com/40/FF0000/FFFFFF?text=AV"} />}
            <MessageContent self={msg.remetente === currentUser.name}>
              <MessageAuthor self={msg.remetente === currentUser.name}>{msg.remetente}</MessageAuthor>
              <MessageText>{msg.texto}</MessageText>
            </MessageContent>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>
      <ChatInputArea>
        <Input 
          placeholder="Mensagem para o chat global..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <SendButton onClick={handleSendMessage}>Enviar</SendButton>
      </ChatInputArea>
    </ChatArea>
  );
}

// ... Estilos ...
const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #36393f; 
`;

const ChatHeader = styled.div`
  background-color: #36393f; 
  padding: 10px 20px;
  border-bottom: 1px solid #202225; 
  display: flex;
  align-items: center;
  height: 48px;

  h2 {
    font-size: 1.1em;
    margin: 0;
    color: #ffffff;
  }
`;

const ChatMessages = styled.div`
  flex-grow: 1;
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

  ${props => props.self && `
    justify-content: flex-end;
  `}
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2c2f33; 
`;

const MessageContent = styled.div`
  background-color: #40444b; 
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 70%;
  text-align: left;
  ${props => props.self && `
    background-color: #5865f2; 
    color: #ffffff;
  `}
`;

const MessageAuthor = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #5865f2; 
  ${props => props.self && `
    color: #ffffff;
  `}
`;

const MessageText = styled.p`
  font-size: 0.95em;
  line-height: 1.4;
`;

const ChatInputArea = styled.div`
  padding: 15px 20px;
  background-color: #36393f; 
  border-top: 1px solid #202225; 
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  background-color: #40444b; 
  color: #dcddde; 
  font-size: 1em;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #5865f2; 
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: #5865f2; 
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4752c4; 
  }
`;

const MobileHeader = styled.div`
  display: none; 
  @media (max-width: 768px) { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #202225; 
    color: #dcddde; 
    height: 48px;
    flex-shrink: 0;
    width: 100%;
    position: relative; 
    z-index: 50; 
  }
`;

const MobileTitle = styled.h2`
  font-size: 1.1em;
  margin: 0;
  color: #dcddde; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 100px);
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #dcddde; 
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
`;

export default ChatGlobal;