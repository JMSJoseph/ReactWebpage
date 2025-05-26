import { useState } from 'react'
import styles from '../../css/Posts.module.css'

interface PostProps {
    title: string;
    description: string;
}

function Posts( {title, description} : PostProps) {
    return (
        <li className={styles.posts}>
            <h1>{title}</h1>
            <p>{description}</p>
        </li>
        
    )
}




export default Posts