import { useState } from 'react'
import styles from '../../css/Navbar.module.css'

function Navbar() {
    return (
        <ul className={styles.navbar}>
            <li>Home</li>
            <li>About</li>
            <li>Github</li>
            <li>Theme</li>
        </ul>
    )
}



export default Navbar