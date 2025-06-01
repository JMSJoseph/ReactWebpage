import { useState } from 'react'
import styles from '../../css/Navbar.module.css'

function Navbar() {
    return (
        <ul className={styles.navbar}>
            <li>
                <a>
                    Home
                </a>
            </li>
            <li>
                <a 
                href='https://github.com/JMSJoseph/ReactWebpage/blob/main/README.md'
                target="_blank" 
                rel="noopener noreferrer"
                >
                About
                </a>
            </li>
            <li>
                <a 
                href='https://github.com/JMSJoseph'
                target="_blank" 
                rel="noopener noreferrer"
                >
                Github
                </a>
            </li>
            <li>
                <a>
                    Theme
                </a>
            </li>
        </ul>
    )
}



export default Navbar