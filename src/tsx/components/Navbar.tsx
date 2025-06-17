import { useContext, useState } from 'react'
import styles from '../../css/Navbar.module.css'
import {ThemeContext} from '../context/context'
import LoginModal from './LoginModal'

function Navbar() {
    /*
        Theme context from APP
        Login Modal state 
    */
    const context = useContext(ThemeContext)
    const [activeLoginModal, setActiveLoginModal] = useState<boolean>(false);
    /*
        Theme changes on click of theme button,
        Spawns login modal on login click
        The other two buttons are just basic href links
    */
    return (
        <div className={styles.navbardiv}>
            {activeLoginModal && (
                <LoginModal onExit={() => setActiveLoginModal(false)}></LoginModal>
            )}
            <ul className={`${styles.navbar}
            ${context?.theme === "dark" ? styles.navbar_dark: styles.navbar_light}`}>
                <li className={`${context?.theme === "dark" ? styles.darkHover: styles.lightHover}`} onClick={() => setActiveLoginModal(true)}>
                    <a>
                        Login
                    </a>
                </li>
                <li className={`${context?.theme === "dark" ? styles.darkHover: styles.lightHover}`}>
                    <a 
                    href='https://github.com/JMSJoseph/ReactWebpage/blob/main/README.md'
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    About
                    </a>
                </li>
                <li className={`${context?.theme === "dark" ? styles.darkHover: styles.lightHover}`}>
                    <a 
                    href='https://github.com/JMSJoseph'
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    Github
                    </a>
                </li>
                <li className={`${context?.theme === "dark" ? styles.darkHover: styles.lightHover}`} onClick={() => {context?.onThemeChange()}}>
                    <a>
                        Theme
                    </a>
                </li>
            </ul>
        </div>
    )
}



export default Navbar