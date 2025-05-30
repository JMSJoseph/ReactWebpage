import styles from '../../css/Titlebar.module.css'

function TitleBar() {

    return (
        <ul className={styles.titlebar}>
            <li>
                <textarea defaultValue="Untitled Board" maxLength={30} >
                </textarea>
            </li>
        </ul>
    )
}



export default TitleBar