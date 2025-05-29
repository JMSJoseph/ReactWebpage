import { useRef, useState, type JSX } from 'react';
import styles from '../../css/PostModal.module.css'


interface PostModalProps {
    postData: PostData;
    onExit: (newData: PostData, colNumber: number, postNumber: number) => void;
    colNumber: number;
    postNumber: number;
}

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

  // fallback
  console.log("fallback")
  return <div />;
}



function PostModal( {postData, onExit, colNumber, postNumber} : PostModalProps) {
    const [postContent, setPostContent] = useState<PostData>(postData)
    const titleRef= useRef<HTMLTextAreaElement>(null);
    const descriptionRef= useRef<HTMLTextAreaElement>(null);
    const attachmentRef= useRef<HTMLTextAreaElement>(null);
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
    return (
        <>
            <div className={styles.postModalOverlay}>
                <div className={styles.postModalMiddle}>
                    <h1 className={styles.close} onClick={() => onExit(postContent, colNumber, postNumber)}>X</h1>
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