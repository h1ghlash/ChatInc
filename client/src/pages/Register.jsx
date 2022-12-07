import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.svg"
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import {registerRoute} from "../utils/APIRoutes";

const Register = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    const handleValidation = () => {
        const {password, confirmPassword, username, email} = values;
        let result = true;
        if(password !== confirmPassword) {
            toast.error("password's should be the same", toastOptions)
            result = false;
        }

        if(username.length < 3) {
            toast.error("Username should be greater than 3 characters", toastOptions);
            result = false;
        }
        if(password.length <= 8) {
            toast.error("Password should be equal or greater than 8 characters", toastOptions)
            result = false;
        }
        if(email==="") {
            toast.error("Email is required", toastOptions);
            result = false;
        }
        return result;
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()){
            const {password, username, email} = values;
            const {data} = await axios.post(registerRoute, {
                username,
                email,
                password,
            }, {
                withCredentials: true,
            })
            if(data)
            {
                navigate("/");
            }
            if(data.status === false){
                toast.error(data.msg, toastOptions);
            }
        }
    };
    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    }
    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo"/>
                        <h1>ChatInc</h1>
                    </div>
                    <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)}/>
                    <input type="email" placeholder="Email" name="email" onChange={(e) => handleChange(e)}/>
                    <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)}/>
                    <input type="password" placeholder="Confirm password" name="confirmPassword" onChange={(e) => handleChange(e)}/>
                    <button type="submit">Create User</button>
                    <span>already have an account? <Link to="/login">Login</Link></span>
                </form>
            </FormContainer>
            <ToastContainer/>
        </>
    );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color:#0F0F0F;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    
    h1{
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    font-family: "Roboto Thin", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color:rgb(33,33,33);
    border-radius: 2rem;
    padding: 3rem 5rem;
  input {
    background-color: #0F0F0F;
    padding: 1rem;
    border: 0.1rem solid #212121 ;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #8774e1 ;
      outline: none;
    }
  } 
    button {
      background-color: #8774e1;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color:#212121  ;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a{
        color: #8774e1;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;
export default Register;