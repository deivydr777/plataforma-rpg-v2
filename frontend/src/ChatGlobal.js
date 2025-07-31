import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com"; // <-- SEU URL REAL AQUI!

function ChatGlobal({ currentUser, toggleCommunitiesSidebar, toggleChannelsSidebar }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(SOCKET_SERVER_URL);

      socket.current.on('receber_mensagem', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (socket.current) { 
        socket.current.emit('entrar_sala', `global-global`); 
        setMessages([]);
        console.log(`Entrando na sala global: global-global`);
    }
  }, [socket.current]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket.current) { 
      const messageData = {
        sala: `global-global`, 
        remetente: currentUser.name, 
        avatar: currentUser.avatar, 
        texto: inputMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      
      socket.current.emit('enviar_mensagem', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

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