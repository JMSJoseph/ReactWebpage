import { useContext, useRef, type JSX } from 'react'
import styles from '../../css/Posts.module.css'
import {BoardContext, type contextInfo, ThemeContext, type themeInfo} from '../context/context'

/*
    Props
*/

interface PostProps {
    title: string;
    attachment: string;
    isGhost: boolean;
    colNumber: number;
    postNumber: number;
}


/*
    See postModal, same logic
*/
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

  return <div />;
}

function Posts( {title, attachment, isGhost, postNumber, colNumber} : PostProps) {
    /*
        boardContext for function props
        contextTheme is theme css determiner
        mousePos, see LoginModal, postModal for explanation
    */
    const context = useContext(BoardContext)
    const contextTheme = useContext(ThemeContext)
    const mousePos = useRef<{x: number; y:number} | null>(null)

    function handleMouseDown(e: React.MouseEvent) {
        if(e.button !== 0){
            return
        }
        mousePos.current = {x: e.clientX, y: e.clientY}
    }

    function handleMouseUp(e: React.MouseEvent) {
        if(mousePos.current == null){
            return false
        }
        let testMousePos = {x: e.clientX, y: e.clientY}
        let distance = Math.sqrt( Math.pow((testMousePos.x - mousePos.current.x), 2) + Math.pow((testMousePos.y - mousePos.current.y), 2))
        mousePos.current = null
        if(distance > 6.0){
            return false
        }
        return true
    }

    /*
        Ghosts spawn posts and send up their props to Board
        Regular posts send their props to spawn post modal
        Click vs Drag detection
        Renders attachment
    */
    if(isGhost === false) {
        return (
            <li className={`${styles.posts}
            ${contextTheme?.theme === "dark" ? styles.posts_dark: styles.posts_light}`} onMouseDown = {(e) => handleMouseDown(e)} onMouseUp = {(e) => {if(handleMouseUp(e)) {context?.onPostClick(colNumber, postNumber, false)}} } onMouseEnter={() => context?.onPostFocus(colNumber, postNumber)} onMouseLeave={() => context?.onPostBlur(colNumber, postNumber)}>
                <button className={styles.postDelete} onMouseUp = {(e) => e.stopPropagation()} onClick={(e: React.MouseEvent) => {e.stopPropagation(); context?.onPostDelete(colNumber, postNumber)}}>X</button>
                <h1>{title}</h1>
                <div className={styles.attachment}>{attachment && renderAttachment(attachment)}</div>
            </li>
        )
    }
    return (
        <li className={`${styles.posts}
        ${contextTheme?.theme === "dark" ? styles.posts_dark: styles.posts_light}`} onMouseDown = {(e) => handleMouseDown(e)} onMouseUp = {(e) => {if(handleMouseUp(e)) {context?.onPostClick(colNumber, postNumber, true)}} } onMouseEnter={() => context?.onPostFocus(colNumber, postNumber)} onMouseLeave={() => context?.onPostBlur(colNumber, postNumber)}>
            <h1 className={styles.ghostpostsh}>+</h1>
        </li>
    )
}




export default Posts