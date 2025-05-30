import { useEffect, useState } from 'react'
import styles from '../../css/Columns.module.css'
import boardstyles from '../../css/Board.module.css'
import Columns from './Columns';
import PostModal from './PostModal'


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

    useEffect(() => {
    if (needsUpdate) {
        sendRequest();
        setNeedsUpdate(false); 
    }
    }, [colArray, needsUpdate]);

    useEffect(() => {
        fetchData()
    }, []);

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
            console.log(columnNumber, postNumber)
        }
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

    function handlePostModalSave(newData: PostData, colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts[postNumber] = newData
        setColArray(newColArray)
        setActivePostModal(null)
        setNeedsUpdate(true)

    }

    function handleColTitleSave(colNumber: number, newTitle: string){
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].title = newTitle
        setColArray(newColArray)
        setNeedsUpdate(true)
    }

    return (
        <div className={boardstyles.board}>
            {activePostModal && (
                <PostModal postData={structuredClone(colArray[activePostModal.columnIndex].posts[activePostModal.postIndex])} 
                onExit={handlePostModalSave} colNumber={activePostModal.columnIndex} postNumber={activePostModal.postIndex}></PostModal>
            )}
            <ul className={styles.columns}>
                {colArray.map((column, index) => (
                    <Columns key={index} title={column.title} posts={column.posts} 
                    onPostClickManager={(colNumber: number, postNumber: number, state: boolean) => handlePostClick(colNumber, postNumber, state)} colNumber={index} isGhost = {column.isGhost}
                    onColumnClick ={() => handleColClick(column.isGhost)} onTitleChange={(colNumber: number, newTitle:string) => handleColTitleSave(colNumber, newTitle)}>
                    </Columns>
                ))}
            </ul>
        </div>
    )
}



export default Board