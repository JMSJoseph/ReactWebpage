import { useState } from 'react'
import styles from '../../css/MainPage.module.css'
import Navbar from '../components/Navbar'
import Posts from '../components/Posts'

function MainPage() {
    return (
        <div className={styles.mainPage}>
            <div className={styles.top}>
                <Navbar></Navbar>
            </div>
            <div className={styles.pageContent}>
                <Posts></Posts>
            </div>
        </div>
    )
}



export default MainPage