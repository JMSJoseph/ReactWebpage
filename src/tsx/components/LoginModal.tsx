import { useContext, useEffect, useRef, useState, type JSX } from 'react';
import styles from '../../css/loginModal.module.css'
import {ThemeContext, UuidContext, type themeInfo} from '../context/context'


interface LoginModalProps {
    onExit: () => void;
}




function LoginModal( {onExit} : LoginModalProps) {
    const context = useContext(ThemeContext)
    const contextUuid = useContext(UuidContext)
    const [loginInfo, setLoginInfo] = useState<{user: string | null; password:string | null;} | null>(null);

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


    function attemptLogin() {
        fetchData()
    }
    function registerUser() {
        sendRequest()
    }


    function handleUserUpdate(newVal: string){
        if(loginInfo){
        setLoginInfo({user: newVal, password: loginInfo.password})
        }
        else{
            setLoginInfo({user: newVal, password: null})
        }
    }

    function handlePassUpdate(newVal: string){
        if(loginInfo){
        setLoginInfo({user: loginInfo.user, password: newVal})
        }
        else{
            setLoginInfo({user: null, password: newVal})
        }
    }

    return (
        <>
            <div className={styles.loginModalOverlay} onClick={() => onExit()}>
                <div className={`${styles.loginModalMiddle}
                ${context?.theme === "dark" ? styles.loginModalMiddle_dark : styles.loginModalMiddle_light}`} onClick={(e: React.MouseEvent)=> e.stopPropagation()}>
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