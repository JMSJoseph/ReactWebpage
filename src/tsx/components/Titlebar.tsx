import { useState } from 'react'
import styles from '../../css/Titlebar.module.css'

function TitleBar() {
    return (
        <ul className={styles.titlebar}>
            <li>
                <textarea defaultValue="Untitled Board" >
                </textarea>
            </li>
        </ul>
    )
}



export default TitleBar