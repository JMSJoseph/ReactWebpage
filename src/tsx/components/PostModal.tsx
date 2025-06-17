import { useContext, useEffect, useRef, useState, type JSX } from 'react';
import styles from '../../css/PostModal.module.css'
import {ThemeContext, type themeInfo} from '../context/context'


/*
    Props
*/

interface PostModalProps {
    postData: PostData;
    onExit: (newData: PostData, colNumber: number, postNumber: number) => void;
    colNumber: number;
    postNumber: number;
}

/*
    renders attachment using regex
    just returns an empty div if nothing matches
*/
function renderAttachment(attachment: string): JSX.Element{
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(attachment)) {
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




function PostModal( {postData, onExit, colNumber, postNumber} : PostModalProps) {
    /*
        multiple refs for text areas
        context for Theme
        mousePos ref as it is not something that needs to rerender and the same logic as LoginModal
    */
    const [postContent, setPostContent] = useState<PostData>(postData)
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const descriptionRef= useRef<HTMLTextAreaElement>(null);
    const attachmentRef= useRef<HTMLTextAreaElement>(null);
    const context = useContext(ThemeContext)
    const mousePos = useRef<{x: number; y:number} | null>(null)

    /*
        See LoginModal
    */
    function handleMouseDown(e: React.MouseEvent) {
        if(e.button !== 0){
            return
        }
        mousePos.current = {x: e.clientX, y: e.clientY}
    }

    /*
        See LoginModal
    */
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
        Same resizing as column
        Could probably condense this
    */
    useEffect(() => {
    if (descriptionRef.current) {
        descriptionRef.current.style.height = 'auto';
        descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
    }, []);
    function handleTitleUpdate(newValue: string) {
        let newPostData = structuredClone(postContent)
        newPostData.title = newValue
        setPostContent(newPostData)
        if (titleRef.current) {
            titleRef.current.style.height = "auto";
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }

    }
    function handleDescriptionUpdate(newValue: string) {
        let newPostData = structuredClone(postContent)
        newPostData.description = newValue
        setPostContent(newPostData)
        if (descriptionRef.current) {
            descriptionRef.current.style.height = "auto";
            descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
        }

    }

    function handleAttachmentUpdate(newValue: string) {
        let newPostData = structuredClone(postContent)
        newPostData.attachment = newValue
        setPostContent(newPostData)
        if (attachmentRef.current) {
            attachmentRef.current.style.height = "auto";
            attachmentRef.current.style.height = `${attachmentRef.current.scrollHeight}px`;
        }

    }
    /*
        See Login Modal essentially the same structure
        title, description, attachment viewable
    */
    return (
        <>
            <div className={styles.postModalOverlay} onMouseDown = {(e) => handleMouseDown(e)} onMouseUp={(e) => {if(handleMouseUp(e)) {onExit(postContent, colNumber, postNumber)}}}>
                <div className={`${styles.postModalMiddle}
                ${context?.theme === "dark" ? styles.postModalMiddle_dark : styles.postModalMiddle_light}`} onMouseDown={(e: React.MouseEvent)=> e.stopPropagation()}>
                    <button className={styles.close} onClick={(e: React.MouseEvent) => {onExit(postContent, colNumber, postNumber)}}>X</button>
                    <div className={styles.attachment}>{postContent.attachment && renderAttachment(postContent.attachment)}</div>
                    <h1>Title</h1>
                    <textarea value={postContent.title} onChange={e => handleTitleUpdate(e.target.value)} className={styles.title} ref={titleRef}></textarea>
                    <h1>Description</h1>
                    <textarea value={postContent.description} onChange={e => handleDescriptionUpdate(e.target.value)} className={styles.description} ref={descriptionRef}></textarea>
                    <h1>Attachment</h1>
                    <textarea value = {postContent.attachment} onChange={e => handleAttachmentUpdate(e.target.value)} className={styles.attachmentURL} ref={attachmentRef}></textarea>
                </div>
            </div>
        </>
    )
}





export default PostModal