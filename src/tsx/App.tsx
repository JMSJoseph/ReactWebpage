import { useEffect, useState } from 'react'
import '../css/App.css'
import MainPage from './pages/MainPage'
import { ThemeContext, type themeInfo, UuidContext, type uuidInfo} from './context/context'




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
    const[curUuid, setUuid] = useState<string | null>(null);
    const themeState: themeInfo = {
        onThemeChange: () => toggleTheme(),
        theme: curTheme
    }
    const uuidState: uuidInfo = {
        onUuidChange: (newUuid: string) => setUuid(newUuid),
        uuid: curUuid
    }
    useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(curTheme);
    }, [curTheme]);
    return (
        <UuidContext.Provider value={uuidState}>
            <ThemeContext.Provider value={themeState}>
                <MainPage></MainPage>
            </ThemeContext.Provider>
        </UuidContext.Provider>
    )
}



export default App