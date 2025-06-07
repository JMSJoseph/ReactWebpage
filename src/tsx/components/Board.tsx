import { useEffect, useState } from 'react'
import styles from '../../css/Columns.module.css'
import boardstyles from '../../css/Board.module.css'
import Columns from './Columns';
import PostModal from './PostModal'
import {BoardContext, type contextInfo} from '../context/context'


const GhostPost: PostData = { title: '+', attachment: '', description: "", isGhost: true }

const TestPost: PostData = { title: "Untitled Post", attachment:'', description: "", isGhost: false}

const defaultPosts: PostData[] = [
    structuredClone(GhostPost)
];

const GhostColumn: ColumnData = {
    title: "+",
    posts: [structuredClone(GhostPost)],
    isGhost: true
}

const TestColumn: ColumnData = {
    title: "Untitled Column",
    posts: [structuredClone(GhostPost)],
    isGhost: false
}

const defaultColumnArray: ColumnData[] = [
    structuredClone(GhostColumn)
]





function Board() {
    const [colArray, setColArray] = useState<ColumnData[]>(structuredClone(defaultColumnArray))
    const [activePostModal, setActivePostModal] = useState<{columnIndex: number; postIndex: number;} | null>(null);
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [postFocused, setPostFocused] = useState<{columnIndex: number; postIndex: number; } | null>(null);
    const [colFocused, setColFocused] = useState<{columnIndex: number} | null>(null);
    useEffect(() => {
    if (needsUpdate) {
        sendRequest();
        setNeedsUpdate(false); 
    }
    }, [colArray, needsUpdate]);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        function handleKeydown(e: KeyboardEvent) {
            let newColArray = structuredClone(colArray)
            if(!postFocused) {
                return;
            }
            if(colArray[postFocused.columnIndex].posts[postFocused.postIndex].isGhost){
                return;
            }
            let postsArray = newColArray[postFocused.columnIndex].posts
            if(e.code === 'KeyS') {
                if(postFocused.postIndex < postsArray.length - 2) {
                    postsArray.splice(postFocused.postIndex+1, 0, postsArray.splice(postFocused.postIndex, 1)[0]);
                }
                else
                {
                    postsArray.splice(0, 0, postsArray.splice(postFocused.postIndex, 1)[0]);
                }
            }
            else if (e.code === 'KeyW') {
                postsArray.splice(postFocused.postIndex-1, 0, postsArray.splice(postFocused.postIndex, 1)[0]);
            }
            else if (e.code === 'KeyD') {
                let rightColumn
                if(postFocused.columnIndex + 1 < newColArray.length - 1) {
                    rightColumn = newColArray[postFocused.columnIndex + 1]
                }
                else
                {
                    rightColumn = newColArray[0]
                }
                let rightColumnIndex = rightColumn.posts.length - 1
                if(rightColumn.posts.length > 1) {
                    if(postFocused.postIndex < rightColumn.posts.length - 1)
                    {
                        rightColumnIndex = postFocused.postIndex
                    }
                    let temp: PostData = structuredClone(postsArray[postFocused.postIndex])
                    postsArray.splice(postFocused.postIndex, 1)
                    rightColumn.posts.splice(rightColumnIndex, 0, temp);
                }
                else
                {
                    let temp: PostData = structuredClone(postsArray[postFocused.postIndex])
                    rightColumn.posts.splice(rightColumn.posts.length-1, 1) 
                    rightColumn.posts = [... rightColumn.posts, temp, structuredClone(GhostPost)]
                    postsArray.splice(postFocused.postIndex, 1)
                }
            }
            else if (e.code === 'KeyA') {
                let leftColumn
                if(postFocused.columnIndex - 1 >= 0) {
                    leftColumn = newColArray[postFocused.columnIndex - 1]
                }
                else
                {
                    leftColumn= newColArray[newColArray.length-2]
                }
                let leftColumnIndex = leftColumn.posts.length - 1
                if(leftColumn.posts.length > 1) {
                    if(postFocused.postIndex < leftColumn.posts.length - 1)
                    {
                        leftColumnIndex = postFocused.postIndex
                    }
                    let temp: PostData = structuredClone(postsArray[postFocused.postIndex])
                    postsArray.splice(postFocused.postIndex, 1)
                    leftColumn.posts.splice(leftColumnIndex, 0, temp);
                }
                else
                {
                    let temp: PostData = structuredClone(postsArray[postFocused.postIndex])
                    leftColumn.posts.splice(leftColumn.posts.length-1, 1) 
                    leftColumn.posts = [... leftColumn.posts, temp, structuredClone(GhostPost)]
                    postsArray.splice(postFocused.postIndex, 1)
                }
            }
            setColArray(newColArray)
            setNeedsUpdate(true)
        }
        window.addEventListener('keydown', handleKeydown)
        return () => window.removeEventListener('keydown', handleKeydown)
        
    }, [postFocused, colArray]);

    useEffect(() => {

        function handleKeydown(e: KeyboardEvent) {
            let newColArray = structuredClone(colArray)
            if(!colFocused || postFocused){
                return;
            }
            if(e.code === "KeyD") {
                if(colFocused.columnIndex < newColArray.length -2){
                    newColArray.splice(colFocused.columnIndex+1, 0, newColArray.splice(colFocused.columnIndex, 1)[0]);
                }
                else{
                    newColArray.splice(0, 0, newColArray.splice(colFocused.columnIndex, 1)[0]);
                }
            }
            else if(e.code === "KeyA") {
                newColArray.splice(colFocused.columnIndex-1, 0, newColArray.splice(colFocused.columnIndex, 1)[0]); 
            }
            setColArray(newColArray)
            setNeedsUpdate(true)
        }
        window.addEventListener('keydown', handleKeydown)
        return () => window.removeEventListener('keydown', handleKeydown)
        
    }, [colFocused, colArray]);

    function fetchData() {
        const url = `${import.meta.env.VITE_FLASK}/get-board`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                if(responseData.length > 0)
                {
                    setColArray(responseData)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }   


    function sendRequest(){
        const url = `${import.meta.env.VITE_FLASK}/set-board`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(colArray)
        }
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Response:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }


    function handlePostClick(columnNumber: number, postNumber: number, state: boolean) {
        if(state) {
            let copyColArray: ColumnData[] = structuredClone(colArray)
            let changingCol: ColumnData = copyColArray[columnNumber]
            changingCol.posts.splice(changingCol.posts.length-1, 1) 
            changingCol.posts = [... changingCol.posts, structuredClone(TestPost), structuredClone(GhostPost)]
            setColArray(copyColArray)
            setNeedsUpdate(true)
        }
        else {
            setActivePostModal({columnIndex: columnNumber, postIndex: postNumber})
        }
    }

    function handlePostDelete(colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts.splice(postNumber, 1)
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    function handlePostFocus(colNumber: number, postNumber: number, state:boolean) {
        if(state){
            setPostFocused({columnIndex: colNumber, postIndex: postNumber})
            setColFocused(null)
        }
        else{
            setPostFocused(null)
        }
    }

    function handlePostModalSave(newData: PostData, colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts[postNumber] = newData
        setColArray(newColArray)
        setActivePostModal(null)
        setNeedsUpdate(true)

    }

    function handleColClick(state: boolean) {
        if(state) {
            let copyColArray: ColumnData[] = structuredClone(colArray)
            copyColArray.splice(copyColArray.length - 1, 1)
            let changedArray: ColumnData[] = [...copyColArray, structuredClone(TestColumn), structuredClone(GhostColumn)]
            setColArray(changedArray)
            setNeedsUpdate(true)
        }
    }

    function handleColDelete(colNumber: number){
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray.splice(colNumber, 1)
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    function handleColTitleSave(colNumber: number, newTitle: string){
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].title = newTitle
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    function handleColFocused(colNumber: number, state: boolean){
        if(state){
            setColFocused({columnIndex: colNumber})
        }
        else
        {
            setColFocused(null)
        }
        console.log(colFocused)
    }

    const contextState: contextInfo = {
        onPostClick: (columnNumber, postNumber: number, state: boolean) => handlePostClick(columnNumber, postNumber, state),
        onColumnClick: () => handleColClick(true),
        onTitleChange: (colNumber: number, newTitle:string) => handleColTitleSave(colNumber, newTitle),
        onPostDelete: (colNumber: number, postNumber: number) => handlePostDelete(colNumber, postNumber),
        onColumnDelete: (colNumber) => handleColDelete(colNumber),
        onPostFocus: (colNumber: number, postNumber: number) => handlePostFocus(colNumber, postNumber, true),
        onPostBlur: (colNumber: number, postNumber: number) => handlePostFocus(colNumber, postNumber, false),
        onColumnFocus: (colNumber) => handleColFocused(colNumber, true),
        onColumnBlur: (colNumber) => handleColFocused(colNumber, false)
    }

    return (
        <div className={boardstyles.board}>
            {activePostModal && (
                <PostModal postData={structuredClone(colArray[activePostModal.columnIndex].posts[activePostModal.postIndex])} 
                onExit={handlePostModalSave} colNumber={activePostModal.columnIndex} postNumber={activePostModal.postIndex}></PostModal>
            )}
            <BoardContext.Provider value={contextState}>
                <ul className={styles.columns}>
                    {colArray.map((column, index) => (
                        <Columns key={index} title={column.title} posts={column.posts} isGhost={column.isGhost} colNumber={index} isHovered={postFocused} />
                    ))}
                </ul>
            </BoardContext.Provider>
        </div>
    )
}



export default Board