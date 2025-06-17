import { useContext, useEffect, useRef, useState, type JSX } from 'react';
import styles from '../../css/loginModal.module.css'
import {ThemeContext, UuidContext, type themeInfo} from '../context/context'

/*
    Props
*/

interface LoginModalProps {
    onExit: () => void;
}




function LoginModal( {onExit} : LoginModalProps) {
    /*
        theme and uuid context from App
        Login State and Mousepos to prevent dragging events
        mousePos ref as it doesnt need to be state causing rerenders and I need it for checking drag vs click
    */
    const context = useContext(ThemeContext)
    const contextUuid = useContext(UuidContext)
    const [loginInfo, setLoginInfo] = useState<{user: string | null; password:string | null;} | null>(null);
    const mousePos = useRef<{x: number; y:number} | null>(null)

    /* 
        only sets mousePos if button is left
    */
    function handleMouseDown(e: React.MouseEvent) {
        if(e.button !== 0){
            return
        }
        mousePos.current = {x: e.clientX, y: e.clientY}
    }
    /*
        Checks the distance moved once mouse is let go, only triggers if its a small movement
    */
    function handleMouseUp(e: React.MouseEvent) {
        if(mousePos.current == null){
            return false
        }
        let testMousePos = {x: e.clientX, y: e.clientY}
        let distance = Math.sqrt( Math.pow((testMousePos.x - mousePos.current.x), 2) + Math.pow((testMousePos.y - mousePos.current.y), 2))
        mousePos.current = null
        if(distance > 6.0){
            return false
        }
        return true
    }

    /*
        POST for registering user
    */
    function sendRequest(){
    const url = `${import.meta.env.VITE_FLASK}/register-user`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
    }
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Response:', responseData);
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
    /*
        GET for user UUID
    */
    function fetchData() {
        if(!loginInfo || !loginInfo.password || !loginInfo.user)
        {
            return;
        }
        const params = new URLSearchParams({
            user: loginInfo.user,
            password: loginInfo.password
        });
        const url = `${import.meta.env.VITE_FLASK}/login-user?${params.toString()}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                if(responseData.uuid){
                    contextUuid?.onUuidChange(responseData.uuid)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }  

    /*
        basically wrappers
    */
    function attemptLogin() {
        fetchData()
    }
    function registerUser() {
        sendRequest()
    }

    /*
        for password ref to state object
    */
    function handleUserUpdate(newVal: string){
        if(loginInfo){
        setLoginInfo({user: newVal, password: loginInfo.password})
        }
        else{
            setLoginInfo({user: newVal, password: null})
        }
    }

    /*
        for user ref to state object
    */
    function handlePassUpdate(newVal: string){
        if(loginInfo){
        setLoginInfo({user: loginInfo.user, password: newVal})
        }
        else{
            setLoginInfo({user: null, password: newVal})
        }
    }

    /*
        Theme css checks
        triggers login attempt on click of login button and register on register button
        Closes on either clicking x or the background overlay
    */
    return (
        <>
            <div className={styles.loginModalOverlay}onMouseDown = {(e) => handleMouseDown(e)} onMouseUp={(e) => {if(handleMouseUp(e)) {onExit()}}}>
                <div className={`${styles.loginModalMiddle}
                ${context?.theme === "dark" ? styles.loginModalMiddle_dark : styles.loginModalMiddle_light}`} onMouseDown={(e: React.MouseEvent)=> e.stopPropagation()}>
                    <button className={styles.close} onClick={() => onExit()}>X</button>
                    <h1>Username: </h1>
                    <input value={loginInfo?.user} placeholder='Enter Username' onChange={e => handleUserUpdate(e.target.value)}></input>
                    <h1>Password: </h1>
                    <input type='password' value={loginInfo?.password} placeholder='Enter Password'  onChange={e => handlePassUpdate(e.target.value)}></input>
                    <button className={styles.formButtons} onClick={() => attemptLogin()}>Login</button>
                    <button className={styles.formButtons} onClick={() => registerUser()}>Register</button>
                </div>
            </div>
        </>
    )
}





export default LoginModal