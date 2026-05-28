import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw Error('useTheme must be used inside a ThemeContextProvider')
    }
    return context
}
