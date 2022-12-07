import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Avatar from "../assets/user.png";

const Contacts = ({contacts, currentUser, changeChat, currentName}) => {
    const [currentUserName,setCurrentUserName] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    useEffect(() => {
        if(currentUser) {
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    return (
        <>
            {(
                <Container>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>Chatinc</h3>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact._id}
                                    className={`contact ${
                                        index === currentSelected ? "selected" : ""
                                    }`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                        <img
                                            src={Avatar}
                                            alt=""
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={Avatar}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{currentName}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: rgb(33,33,33);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 2rem;
    }

    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      position: relative;
      &:hover {
        background-color: #0F0F0F;
      }
      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          position: absolute;
          color: white;
          left: 4.5vw;
          bottom: 5.7vh;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;