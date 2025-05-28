import styles from '../../css/Columns.module.css'
import Posts from './Posts';

interface PostData {
    title: string;
    attachment: string;
    isGhost: boolean;
}

interface ColumnElementProps {
    title: string;
    posts: PostData[];
    onPostClickManager: (colNumber: number, state: boolean) => void;
    colNumber: number;
    isGhost: boolean;
    onColumnClick: () => void;
}


function Columns( {title, posts, onPostClickManager, colNumber, isGhost, onColumnClick} : ColumnElementProps) {
    if(isGhost == false){
        return (
            <div className={styles.columnsDiv}>
                <li className={styles.columnsLi} onClick = {onColumnClick}>
                    <h1 className={styles.columnsHeader}>{title}</h1>
                    <ul>
                        {posts.map((post, index) => (
                            <Posts key = {index} title={post.title} attachment={post.attachment} isGhost={post.isGhost} onPostClick={() => onPostClickManager(colNumber, post.isGhost)}></Posts>
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