import { useContext, useEffect, useRef, useState} from 'react';
import styles from '../../css/Columns.module.css'
import Posts from './Posts';
import {BoardContext, ThemeContext} from '../context/context'


/*
    Props
*/
interface ColumnElementProps {
    title: string;
    posts: PostData[];
    colNumber: number;
    isGhost: boolean;
    isHovered: {columnIndex: number; postIndex: number} | null;
}


function Columns( {title, posts, colNumber, isGhost, isHovered} : ColumnElementProps) {
    /*
        titleRef = reference to title textarea
        titleStore is the state object for onChange for the ref
        hovered is to change the css
        themeContext is for css theme
    */
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const [titleStore, setTitleStore] = useState<string>(title)
    const [hovered, setHovered] = useState<boolean>(false)
    const contextTheme = useContext(ThemeContext)

    /*
        Sideeffects of changing title
    */
    useEffect(() => {
        setTitleStore(title);
    }, [title]);


    /*
        Resize text area if needed on update
    */
    function handleTitleUpdate(newValue: string) {
        setTitleStore(newValue)
        if (titleRef.current) {
            titleRef.current.style.height = "auto";
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }

    }

    /*
        See Board contextInfo
        Provides alot of function props
    */
    const context = useContext(BoardContext)

    /*
        Alot going on here
        hovered changes the css of the Column to be outlined on MouseLeave/Enter
        IsHovered should be called ifPostHovered, as no post needs to be hovered and the column needs to be hovered for columns to be moved
        Theme checks for dark/light mode
        Title store changes
        Posts mapped based on Colarray from Board
        Deletes on X click, no propogation
        Ghost columns do not get moved so that logic is missing from them
    */
    if(isGhost === false){
        return (
            <div className={styles.columnsDiv}>
                <li className={`
                ${styles.columnLi}
                ${contextTheme?.theme === "dark" ? styles.columnsLi_dark: styles.columnsLi_light}
                ${(hovered && isHovered == null) ? (contextTheme?.theme === "dark" ? styles.hovered_dark : styles.hovered_light) : ''}
                `} 
                onMouseOver={() => {setHovered(true); context?.onColumnFocus(colNumber)}} 
                onMouseLeave={() => {setHovered(false); context?.onColumnBlur(colNumber)}} >
                    <button className={styles.colDelete} onClick={(e: React.MouseEvent) => {e.stopPropagation(); context?.onColumnDelete(colNumber)}}>X</button>
                    <textarea className={styles.columnsHeader} value={titleStore} onBlur={() => context?.onTitleChange(colNumber, titleStore)} onChange={e => handleTitleUpdate(e.target.value)} ref={titleRef}></textarea>
                    <ul>
                        {posts.map((post, index) => (
                            <Posts key = {index} title={post.title} attachment={post.attachment} isGhost={post.isGhost} postNumber={index} colNumber={colNumber}/>
                        ))}
                    </ul>
                </li>
            </div>
        )
    }
    else {
        return (
            <div className={`${styles.columnsDiv}`}>
                <li className={`${styles.columnsLi}
                ${contextTheme?.theme === "dark" ? styles.columnsLi_dark: styles.columnsLi_light}
                ${(hovered && isHovered == null) ? (contextTheme?.theme === "dark" ? styles.hovered_dark : styles.hovered_light) : ''}`} onClick = {() => context?.onColumnClick()}
                onMouseOver={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                    <h1 className={styles.columnsHeaderGhost}>{title}</h1>
                </li>
            </div>
        ) 
    }
}





export default Columns