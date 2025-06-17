import { useContext, useEffect, useRef, useState } from 'react';
import styles from '../../css/Titlebar.module.css'
import {UuidContext} from '../context/context'



function TitleBar() {
    /*
        titleRef and store for textArea onChange
        uuidContext for loading user's board name
    */
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const [titleStore, setTitleStore] = useState<string>("Untitled Board")
    const contextUuid = useContext(UuidContext)

    /*
        If logged in
        Get user board name
    */
    useEffect(() => {
        if(contextUuid && contextUuid.uuid != null)
        {
            setTitleStore("Untitled Board")
            fetchData()
        }
    }, [contextUuid?.uuid]);

    /*
        GET request for user board name
    */
    function fetchData() {
    if(!contextUuid || !contextUuid.uuid)
    {
        return;
    }
    const params = new URLSearchParams({
        uuid: contextUuid.uuid
    });
    const url = `${import.meta.env.VITE_FLASK}/get-title?${params.toString()}`
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

    /*
        Wrapper
    */
    function sendRequestWrapper(){
        if(contextUuid && contextUuid.uuid){
            sendRequest()
        }
    }

    /*
        If loggined in, send POST change to user board title
    */
    function sendRequest(){
        if(!contextUuid || !contextUuid.uuid)
        {
            return;
        }
        const params = new URLSearchParams({
            uuid: contextUuid.uuid
        });
        const url = `${import.meta.env.VITE_FLASK}/set-title?${params.toString()}`
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

    /*
        change Title store based on onChange from ref
    */
    function handleTitleUpdate(newVal: string){
        setTitleStore(newVal)
    }
    /*
        When left typing , send request
    */
    return (
        <ul className={styles.titlebar}>
            <li>
                <textarea maxLength={30} value={titleStore} onBlur={() => sendRequestWrapper()} onChange={e => handleTitleUpdate(e.target.value)} ref={titleRef}>
                </textarea>
            </li>
        </ul>
    )
}



export default TitleBar