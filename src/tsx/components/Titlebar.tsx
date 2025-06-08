import { useContext, useEffect, useRef, useState } from 'react';
import styles from '../../css/Titlebar.module.css'
import {ThemeContext, type themeInfo} from '../context/context'



function TitleBar() {
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const [titleStore, setTitleStore] = useState<string>("Untitled Board")
    const context = useContext(ThemeContext)
    useEffect(() => {
        fetchData()
    }, []);

    function fetchData() {
    const url = `${import.meta.env.VITE_FLASK}/get-title`
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
            if(responseData.title)
            {
                setTitleStore(responseData.title)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }   


    function sendRequest(){
        const url = `${import.meta.env.VITE_FLASK}/set-title`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: titleStore})
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

    function handleTitleUpdate(newVal: string){
        setTitleStore(newVal)
    }

    return (
        <ul className={styles.titlebar}>
            <li>
                <textarea maxLength={30} value={titleStore} onBlur={() => sendRequest()} onChange={e => handleTitleUpdate(e.target.value)} ref={titleRef}>
                </textarea>
            </li>
        </ul>
    )
}



export default TitleBar