import { useState } from 'react'
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


    function handlePostClick(columnNumber: number, postNumber: number, state: boolean) {
        if(state) {
            let copyColArray: ColumnData[] = structuredClone(colArray)
            let changingCol: ColumnData = copyColArray[columnNumber]
            changingCol.posts.splice(changingCol.posts.length-1, 1) 
            changingCol.posts = [... changingCol.posts, structuredClone(TestPost), structuredClone(GhostPost)]
            setColArray(copyColArray)
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
        }
    }

    function handlePostModalSave(newData: PostData, colNumber: number, postNumber: number) {
        let newColArray: ColumnData[] = structuredClone(colArray)
        newColArray[colNumber].posts[postNumber] = newData
        setColArray(newColArray)
        setActivePostModal(null)

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
                    onColumnClick ={() => handleColClick(column.isGhost)}>
                    </Columns>
                ))}
            </ul>
        </div>
    )
}



export default Board