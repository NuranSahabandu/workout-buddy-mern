import { useContext } from "react"
import { WorkoutsContext } from "../context/WorkoutContext"
import { useAuthContext } from "../hooks/useAuthContext"

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({workout}) => {

    const {user} = useAuthContext()

    const { setWorkouts } = useContext(WorkoutsContext)

    const handleclick = async () => {

        if(!user) {
            return
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts/` + workout._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setWorkouts((prev) => prev.filter(w => w._id !== json._id))
        }
    }

    return(
        <div className="workout-details">
            <h4>{workout.title}</h4>
            <p><strong>Load (kg): </strong>{workout.load}</p>
            <p><strong>Reps : </strong>{workout.reps}</p>
            <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
            <span className='material-icons' onClick={handleclick}>delete</span>
        </div>
    )
}

export default WorkoutDetails