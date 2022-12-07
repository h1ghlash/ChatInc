import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import Avatar from "../assets/user.png";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import {getAllMessagesRoute, sendMessageRoute} from "../utils/APIRoutes";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {nanoid} from "nanoid"

const ChatContainer = ({currentChat, currentUser, socket, removeCookie}) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const  scrollRef = useRef();
    useEffect(() => {
        async function getMessages(){
            if(currentChat) {
                const response = await axios.post(getAllMessagesRoute, {
                    from: currentUser.id,
                    to: currentChat._id,
                });
                setMessages(response.data);
                console.log(messages);
            }
        }
        getMessages();
    }, [currentChat])

    const handleSendMsg = async (msg) => {
            await axios.post(sendMessageRoute, {
                from: currentUser.id,
                to: currentChat._id,
                message: msg
            })
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: currentUser.id,
                message: msg,
            });

            const msgs = [...messages];
            msgs.push({fromSelf: true, message: msg});
            setMessages(msgs);
    }

    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({fromSelf: false, message: msg});
            })
        }
    }, [])

    useEffect(()=>{
        arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(()=> {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    return (
        <>
            {
                currentChat && (
                    <Container>
                        <div className="chat-header">
                            <div className="user-details">
                                <div className="avatar">
                                    <img
                                        src={Avatar}
                                        alt="avatar"
                                    />
                                </div>
                                <div className="username">
                                    <h3>{currentChat.username}</h3>
                                </div>
                            </div>
                            <Logout removeCookie={removeCookie}/>
                        </div>
                        <div className="chat-messages">
                            {
                                messages.map((message) => {
                                    return (
                                        <div ref={scrollRef} key={nanoid()}>
                                            <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                                                <div className="content">
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <ChatInput handleSendMsg={handleSendMsg}/>
                    </Container>
                )
            }
        </>

    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12% ;
  gap: 0.1rem;
  overflow: hidden;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    background-color: rgb(33,33,33);
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
          text-transform: uppercase;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px)
    {
      grid-template-columns: 15% 70% 15%;
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        font-weight: inherit;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content{
      background-color: rgb(135,116,225);
    }
  }
  
  .received {
   justify-content: flex-start;
    .content {
      background-color: rgb(33,33,33);
    }
  }
`;

export default ChatContainer;