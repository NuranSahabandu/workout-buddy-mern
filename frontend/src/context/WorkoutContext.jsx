import { createContext, useState } from "react";

export const WorkoutsContext = createContext()

export const WorkoutsContextProvider = ({children}) => {
    const [workouts, setWorkouts] = useState(null)
    return (
        <WorkoutsContext.Provider value={{workouts, setWorkouts}}>
        { children }
        </WorkoutsContext.Provider>
    )
}