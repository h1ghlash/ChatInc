import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {allUsersRoute, host, getCurrentUserRoute} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"
import {useCookies} from "react-cookie";

const Chat = () => {
    const socket = useRef();
    const [cookies, removeCookie] = useCookies([]);
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentName, setCurrentName] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate("/login");
            } else {
                const token = cookies.jwt;
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                setCurrentUser(JSON.parse(jsonPayload));
            }
        };
        verifyUser();
    }, [cookies, navigate, removeCookie]);
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser.id);
        }
    }, [currentUser]);
    useEffect( () => {
        async function getUsers(){
            if(currentUser) {
                const data = await  axios.get(`${allUsersRoute}/${currentUser.id}`);
                setContacts(data.data);
            }
        }
        getUsers();

    }, [currentUser])

    async function getCurrentUserName(){
            if(currentUser) {
                const {data} = await  axios.get(`${getCurrentUserRoute}/${currentUser.id}`);
                data.map((name) => {
                    setCurrentName(name.username)
                })
            }
        }
        getCurrentUserName()

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} currentName={currentName}/>
                    {
                       isLoaded && currentChat === undefined
                           ? (<div></div>)
                            : (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} removeCookie={removeCookie}/>)
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