import { useState } from 'react'
import styles from '../../css/Posts.module.css'

function Posts() {
    return (
        <ul className={styles.posts}>
            <li>Test 1</li>
            <li>Test 2</li>
            <li>Test 3</li>
            <li>Test 4</li>
            <li>Test 5</li>
            <li>Test 6</li>
        </ul>
    )
}



export default Posts