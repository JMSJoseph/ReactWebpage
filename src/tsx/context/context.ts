// Contexts.ts
import { createContext } from 'react';



/*
    interfaces for the props passed by board, and app for theme and uuid
*/

export interface contextInfo {
    onPostClick: (columnNumber:number, postNumber: number, state: boolean) => void;
    onColumnClick: () => void;
    onTitleChange: (colNumber: number, newTitle:string) => void;
    onPostDelete: (colNumber: number, postNumber: number) => void;
    onColumnDelete: (colNumber: number) => void;
    onPostFocus: (colNumber: number, postNumber: number) => void;
    onPostBlur: (colNumber: number, postNumber: number) => void;
    onColumnFocus: (colNumber: number) => void;
    onColumnBlur: (colNumber: number) => void;
}

export interface themeInfo {
    onThemeChange: () => void;
    theme: string;
}

export interface uuidInfo {
    onUuidChange: (newUuid: string) => void;
    uuid: string | null;
}

/*
    Context for function prop passing frokm board
    Context for theme for app
    Context for uuid for app
*/
export const BoardContext = createContext<contextInfo | null>(null)

export const ThemeContext = createContext<themeInfo | null>(null)

export const UuidContext = createContext<uuidInfo | null>(null)

