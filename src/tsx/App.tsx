import { useEffect, useState } from 'react'
import '../css/App.css'
import MainPage from './pages/MainPage'
import { ThemeContext, type themeInfo} from './context/context'




function App() {
    function toggleTheme(){
        let testToggle = structuredClone(curTheme)
        if(testToggle === "light"){
            setTheme("dark")
        }
        else
        {
            setTheme("light")
        }
    }
    const[curTheme, setTheme] = useState<string>("light")
    const themeState: themeInfo = {
        onThemeChange: () => toggleTheme(),
        theme: curTheme
    }
    useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(curTheme);
    }, [curTheme]);
    return (
        <ThemeContext.Provider value={themeState}>
            <MainPage></MainPage>
        </ThemeContext.Provider>
    )
}



export default App