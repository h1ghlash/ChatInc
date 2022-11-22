import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {allUsersRoute, host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"
const Chat = () => {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect( () => {
        async function RememberUser(){
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem("chat-app-user")
                    )
                );
                setIsLoaded(true);
            }
        }
        RememberUser();
    }, []);
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);
    useEffect( () => {
        async function getUsers(){
            if(currentUser) {
                const data = await  axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            }
        }
        getUsers();

    }, [currentUser])

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
                    {
                       isLoaded && currentChat === undefined
                           ? (<div></div>)
                            : (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
                    }
                </div>
            </Container>
        </>
    );
};

const Container = styled.div`
    height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .container {
    width: 100vw;
    height: 100vh;
    background-color: #0F0F0F;
    display: grid;
    grid-template-columns: 25% 75% ;
    background-image: url("https://web.telegram.org/z/chat-bg-pattern-dark.ad38368a9e8140d0ac7d.png");
    @media screen and (min-width: 720px) and (max-width: 1080px)
    {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;