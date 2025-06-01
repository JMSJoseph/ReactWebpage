import { useEffect, useRef, useState} from 'react';
import styles from '../../css/Columns.module.css'
import Posts from './Posts';


interface ColumnElementProps {
    title: string;
    posts: PostData[];
    onPostClickManager: (colNumber: number, postNumber: number, state: boolean) => void;
    colNumber: number;
    isGhost: boolean;
    onColumnClick: () => void;
    onTitleChange: (colNumber: number, newTitle:string) => void;
    onPostDeleteManager: (colNumber: number, postNumber: number) => void;
    onColumnDelete: () => void;
    onPostFocusManager: (colNumber: number, postNumber: number) => void;
    onPostBlurManager: (colNumber: number, postNumber: number) => void;
    onColumnFocus: () => void;
    isHovered: {columnIndex: number; postIndex: number} | null;
    onColumnBlur: () => void;
}


function Columns( {title, posts, onPostClickManager, colNumber, isGhost, onColumnClick, onTitleChange, 
    onPostDeleteManager, onColumnDelete, onPostFocusManager, onPostBlurManager, onColumnFocus, isHovered, onColumnBlur} : ColumnElementProps) {
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



    if(isGhost === false){
        return (
            <div className={styles.columnsDiv}>
                <li className={`${styles.columnsLi} ${(hovered && isHovered === null) ? styles.hovered : ''}`} onClick = {onColumnClick} onMouseEnter={() => {setHovered(true); console.log(hovered, isHovered); onColumnFocus()}} onMouseLeave={() => {setHovered(false); console.log(hovered, isHovered); onColumnFocus()}} >
                    <button className={styles.colDelete} onClick={(e: React.MouseEvent) => {e.stopPropagation(); onColumnDelete()}}>X</button>
                    <textarea className={styles.columnsHeader} value={titleStore} onBlur={() => onTitleChange(colNumber, titleStore)} onChange={e => handleTitleUpdate(e.target.value)} ref={titleRef}></textarea>
                    <ul>
                        {posts.map((post, index) => (
                            <Posts key = {index} title={post.title} attachment={post.attachment} isGhost={post.isGhost} 
                            onPostClick={() => onPostClickManager(colNumber, index, post.isGhost)} postNumber={index} onPostDelete={() => onPostDeleteManager(colNumber, index)}
                            onPostFocus={() => onPostFocusManager(colNumber, index)} onPostBlur={() => onPostBlurManager(colNumber, index)}></Posts>
                        ))}
                    </ul>
                </li>
            </div>
        )
    }
    else {
        return (
            <div className={styles.columnsDiv}>
                <li className={styles.columnsLi} onClick = {onColumnClick}>
                    <h1 className={styles.columnsHeaderGhost}>{title}</h1>
                </li>
            </div>
        ) 
    }
}





export default Columns