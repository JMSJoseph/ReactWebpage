import styles from '../../css/MainPage.module.css'
import Navbar from '../components/Navbar'
import TitleBar from '../components/Titlebar'
import Board from '../components/Board'

/*
    Legit just basically htm
*/
function MainPage() {
    return (
        <div className={styles.mainPage}>
            <div className={styles.top}>
                <Navbar></Navbar>
            </div>
            <div className={styles.top2}>
                <TitleBar></TitleBar>
            </div>
            <div className={styles.pageContent}>
                <Board></Board>
            </div>
        </div>
    )
}



export default MainPage