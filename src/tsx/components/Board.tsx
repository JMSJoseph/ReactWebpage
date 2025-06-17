import { useContext, useEffect, useState } from 'react'
import styles from '../../css/Columns.module.css'
import boardstyles from '../../css/Board.module.css'
import Columns from './Columns';
import PostModal from './PostModal'
import {BoardContext, UuidContext, type contextInfo} from '../context/context'


/*
    Just basic objects for a Ghost and Empty Post/Column
    Never got around to renaming Test to Empty on columns and Posts
*/

const GhostPost: PostData = { title: '+', attachment: '', description: "", isGhost: true }

const TestPost: PostData = { title: "Untitled Post", attachment:'', description: "", isGhost: false}


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
   /*
    Lots of state here, could maybe be decoupled
    activatePostModal - spawns post modal based on currentPost
    colFocused and postFocused are self explanatory
    needsUpdate is for sending POST requests
    loading keeps the user from modifying data while loading
    colArray is the main big state object which is a 2D array of post and columns basically, (Its more like An array of two objects)
    */

    const [colArray, setColArray] = useState<ColumnData[]>(structuredClone(defaultColumnArray))
    const [activePostModal, setActivePostModal] = useState<{columnIndex: number; postIndex: number;} | null>(null);
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
    const [postFocused, setPostFocused] = useState<{columnIndex: number; postIndex: number; } | null>(null);
    const [colFocused, setColFocused] = useState<{columnIndex: number} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const contextUuid = useContext(UuidContext)
    /*
        If logged in, then send a POST request to the backend on update
    */
    useEffect(() => {
    if (needsUpdate && contextUuid && contextUuid.uuid != null) {
        sendRequest();
        setNeedsUpdate(false); 
    }
    }, [colArray, needsUpdate]);

    /*
        When Uuid is updated (login) fetch the data from the backend
    */
    useEffect(() => {
        if(contextUuid && contextUuid.uuid != null)
        {
            const runFetch = async () => {
                setColArray(defaultColumnArray)
                setLoading(true)
                console.log(loading)
                await fetchData();
            };
            runFetch()
        }
    }, [contextUuid?.uuid]);

    /*
        This is for moving Posts
        It is messy and could probably be split into functions,
        But basically it checks that a post is focused and it is not a ghost
        IF that is true, it allows you to move using WASD by doing splice operations on the Array
        The weird conditionals are checks for if its at the end to wrap around and avoid the ghost post
    */

    useEffect(() => {
        function handleKeydown(e: KeyboardEvent) {
            const target = e.target as HTMLElement;
            const tag = target.tagName.toLowerCase();

            if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
                return; 
            }
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

    /*
        Move Columns with A/D
        Not too bad compared to posts but similar logic
        If a post is focused then return as thats selected and a column must be focused
    */

    useEffect(() => {

        function handleKeydown(e: KeyboardEvent) {
            const target = e.target as HTMLElement;
            const tag = target.tagName.toLowerCase();

            if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
                return; 
            }
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

    /*
        GET request for getting user board
    */
    async function fetchData() {
        if(!contextUuid || !contextUuid.uuid)
        {
            return;
        }
        const params = new URLSearchParams({
            uuid: contextUuid.uuid
        });
        const url = `${import.meta.env.VITE_FLASK}/get-board?${params.toString()}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        await fetch(url, options)
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
                    setLoading(false)
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false)
            })
    }   

    /*
        POST Request for setting user board
    */
    function sendRequest(){
        if(!contextUuid || !contextUuid.uuid)
        {
            return;
        }
        const params = new URLSearchParams({
            uuid: contextUuid.uuid
        });
        const url = `${import.meta.env.VITE_FLASK}/set-board?${params.toString()}`
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

    /*
        Handles Post click, just spawns a new post if its a ghost post and spawns the modal if its not
    */
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

    /*
        Delete a post from the state array
    */
    function handlePostDelete(colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts.splice(postNumber, 1)
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    /*
        If a post is focused a column isnt focused, This is reused for mouseEnter and Leave with the boolean (true= enter, false = leave)
    */
    function handlePostFocus(colNumber: number, postNumber: number, state:boolean) {
        if(state){
            setPostFocused({columnIndex: colNumber, postIndex: postNumber})
            setColFocused(null)
        }
        else{
            setPostFocused(null)
        }
    }

    /*
        Update data to state array from modal
    */
    function handlePostModalSave(newData: PostData, colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts[postNumber] = newData
        setColArray(newColArray)
        setActivePostModal(null)
        setNeedsUpdate(true)

    }

    /*
        Columns only care if its a ghost, if so spawn another column before the ghost
    */
    function handleColClick(state: boolean) {
        if(state) {
            let copyColArray: ColumnData[] = structuredClone(colArray)
            copyColArray.splice(copyColArray.length - 1, 1)
            let changedArray: ColumnData[] = [...copyColArray, structuredClone(TestColumn), structuredClone(GhostColumn)]
            setColArray(changedArray)
            setNeedsUpdate(true)
        }
    }

    /*
        Delete column from state array
    */
    function handleColDelete(colNumber: number){
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray.splice(colNumber, 1)
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    /*
        Update from titleRef in Column to the state array
    */
    function handleColTitleSave(colNumber: number, newTitle: string){
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].title = newTitle
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    /*
        Similar to postFocused
    */
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

    /*
        This is so I do not need to pass props (mostly functions) through multiple files
        Helps clean stuff up alot
        Context is useful
    */
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

    /*
        Loading Div displayed when loading data that covers the screen and does not let the user do anything
        activePostModal displays the modal for whatever post is clicked
        columns are mapped to the state array
    */
    return (
        <div className={boardstyles.board}>
            {loading && (
                <div className={boardstyles.loading}></div>
            )}
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