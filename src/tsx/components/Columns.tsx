import { useState } from 'react'
import styles from '../../css/Columns.module.css'
import Posts from './Posts';

interface ColumnElementProps {
    title: string;
}

function ColumnElement( {title} : ColumnElementProps) {
    return (
        <div className={styles.columnsDiv}>
            <li className={styles.columnsLi}>
                <h1 className={styles.columnsHeader}>{title}</h1>
                <ul>
                    <Posts title='test' description='SuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuperSuper'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                    <Posts title='test' description='test'></Posts>
                </ul>
            </li>
        </div>
    )
}

interface ColumnProps{
    posts: string[]
}

function Columns( {posts} :  ColumnProps) {
    return (
        <ul className={styles.columns}>
            {posts.map((column, index) => (
                <ColumnElement key={index} title={column}/>
            ))}

        </ul>
    )
}



export default Columns