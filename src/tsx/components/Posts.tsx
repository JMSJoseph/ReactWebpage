import { type JSX } from 'react'
import styles from '../../css/Posts.module.css'

interface PostProps {
    title: string;
    attachment: string;
    isGhost: boolean;
    onPostClick: () => void;
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

function Posts( {title, attachment, isGhost, onPostClick} : PostProps) {
    if(isGhost == false) {
        return (
            <li className={styles.posts} onClick = {onPostClick}>
                <h1>{title}</h1>
                <div className={styles.attachment}>{attachment && renderAttachment(attachment)}</div>
            </li>
        )
    }
    return (
        <li className={styles.posts} onClick = {onPostClick}>
            <h1 className={styles.ghostpostsh}>+</h1>
        </li>
    )
}




export default Posts