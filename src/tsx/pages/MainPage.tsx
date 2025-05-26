import { useState } from 'react'
import styles from '../../css/MainPage.module.css'
import Navbar from '../components/Navbar'
import Posts from '../components/Posts'
import Columns from '../components/Columns'

function MainPage() {
    return (
        <div className={styles.mainPage}>
            <div className={styles.top}>
                <Navbar></Navbar>
            </div>
            <div className={styles.pageContent}>
                <Columns posts={["Col 1", "Col 2", "Col 3", "Col 4", "Col 1", "Col 2", "Col 3", "Col 4"]}></Columns>
            </div>
        </div>
    )
}



export default MainPage