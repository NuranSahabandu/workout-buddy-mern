import { useAuthContext } from "./useAuthContext"
import { WorkoutsContext } from '../context/WorkoutContext'
import { useContext } from "react"


export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { setWorkouts } = useContext(WorkoutsContext)

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})

        setWorkouts([])

    }

    return {logout}

}