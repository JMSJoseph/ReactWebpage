import { useState } from 'react'
import styles from '../../css/Columns.module.css'
import Columns from './Columns';

interface PostData {
    title: string;
    attachment: string;
    isGhost: boolean;
}

interface ColumnData {
    title: string;
    posts: PostData[];
    isGhost: boolean;
}


const GhostPost: PostData = { title: '+', attachment: '', isGhost: true }

const TestPost: PostData = { title: "test", attachment:'https://wildcatterritory.com/images/stories/virtuemart/product/test.jpg', isGhost: false}

const defaultPosts: PostData[] = [
    structuredClone(GhostPost)
];

const GhostColumn: ColumnData = {
    title: "+",
    posts: [structuredClone(GhostPost)],
    isGhost: true
}

const TestColumn: ColumnData = {
    title: "Unnamed Column",
    posts: [structuredClone(GhostPost)],
    isGhost: false
}

const defaultColumnArray: ColumnData[] = [
    structuredClone(GhostColumn)
]





function Board() {
    const [colArray, setColArray] = useState<ColumnData[]>(structuredClone(defaultColumnArray))

    function handlePostClick(columnNumber: number, state: boolean) {
        if(state) {
            let copyColArray: ColumnData[] = structuredClone(colArray)
            let changingCol: ColumnData = copyColArray[columnNumber]
            changingCol.posts = [structuredClone(TestPost), ...changingCol.posts]
            setColArray(copyColArray)
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

    return (
        <ul className={styles.columns}>
            {colArray.map((column, index) => (
                <Columns key={index} title={column.title} posts={column.posts} 
                onPostClickManager={(colNumber: number,state: boolean) => handlePostClick(colNumber, state)} colNumber={index} isGhost = {column.isGhost}
                onColumnClick ={() => handleColClick(column.isGhost)}>
                </Columns>
            ))}
        </ul>
    )
}



export default Board