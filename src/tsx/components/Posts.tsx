import { useContext, type JSX } from 'react'
import styles from '../../css/Posts.module.css'
import {BoardContext, type contextInfo, ThemeContext, type themeInfo} from '../context/context'

interface PostProps {
    title: string;
    attachment: string;
    isGhost: boolean;
    colNumber: number;
    postNumber: number;
}

function renderAttachment(attachment: string): JSX.Element{
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(attachment)) {
        console.log("isImage")
        return <img src={attachment} alt="Attachment" className={styles.attachment} />;
    }

    if (/\.(mp4|webm|ogg)$/i.test(attachment)) {
        return (
            <video controls className={styles.attachment}>
                <source src={attachment} />
            </video>
        );
  }

  // fallback
  console.log("fallback")
  return <div />;
}

function Posts( {title, attachment, isGhost, postNumber, colNumber} : PostProps) {
    const context = useContext(BoardContext)
    const contextTheme = useContext(ThemeContext)
    if(isGhost === false) {
        return (
            <li className={`${styles.posts}
            ${contextTheme?.theme === "dark" ? styles.posts_dark: styles.posts_light}`} onClick = {() => context?.onPostClick(colNumber, postNumber, false)} onMouseEnter={() => context?.onPostFocus(colNumber, postNumber)} onMouseLeave={() => context?.onPostBlur(colNumber, postNumber)}>
                <button className={styles.postDelete} onClick={(e: React.MouseEvent) => {e.stopPropagation(); context?.onPostDelete(colNumber, postNumber)}}>X</button>
                <h1>{title}</h1>
                <div className={styles.attachment}>{attachment && renderAttachment(attachment)}</div>
            </li>
        )
    }
    return (
        <li className={`${styles.posts}
        ${contextTheme?.theme === "dark" ? styles.posts_dark: styles.posts_light}`} onClick = {() => context?.onPostClick(colNumber, postNumber, true)} onMouseEnter={() => context?.onPostFocus(colNumber, postNumber)} onMouseLeave={() => context?.onPostBlur(colNumber, postNumber)}>
            <h1 className={styles.ghostpostsh}>+</h1>
        </li>
    )
}




export default Posts