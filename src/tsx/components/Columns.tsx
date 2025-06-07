import { useContext, useEffect, useRef, useState} from 'react';
import styles from '../../css/Columns.module.css'
import Posts from './Posts';
import {BoardContext, type contextInfo} from '../context/context'


interface ColumnElementProps {
    title: string;
    posts: PostData[];
    colNumber: number;
    isGhost: boolean;
    isHovered: {columnIndex: number; postIndex: number};
}


function Columns( {title, posts, colNumber, isGhost, isHovered} : ColumnElementProps) {
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const [titleStore, setTitleStore] = useState<string>(title)
    const [hovered, setHovered] = useState<boolean>(false)

    useEffect(() => {
        setTitleStore(title);
    }, [title]);

    function handleTitleUpdate(newValue: string) {
        setTitleStore(newValue)
        if (titleRef.current) {
            titleRef.current.style.height = "auto";
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }

    }

    const context = useContext(BoardContext)

    if(isGhost === false){
        return (
            <div className={styles.columnsDiv}>
                <li className={`${styles.columnsLi} ${(hovered && isHovered === null) ? styles.hovered : ''}`} 
                onMouseOver={() => {setHovered(true); console.log(hovered, isHovered); context?.onColumnFocus(colNumber)}} 
                onMouseLeave={() => {setHovered(false); console.log(hovered, isHovered); context?.onColumnBlur(colNumber)}} >
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
            <div className={styles.columnsDiv}>
                <li className={styles.columnsLi} onClick = {() => context?.onColumnClick()}>
                    <h1 className={styles.columnsHeaderGhost}>{title}</h1>
                </li>
            </div>
        ) 
    }
}





export default Columns