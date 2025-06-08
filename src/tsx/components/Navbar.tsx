import { useContext, useState } from 'react'
import styles from '../../css/Navbar.module.css'
import {ThemeContext, type themeInfo} from '../context/context'
import LoginModal from './LoginModal'

function Navbar() {
    const context = useContext(ThemeContext)
    const [activeLoginModal, setActiveLoginModal] = useState<boolean>(false);
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