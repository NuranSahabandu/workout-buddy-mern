import { useEffect, useContext } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { WorkoutsContext } from '../context/WorkoutContext'

const Home = () => {

    const {workouts, setWorkouts} = useContext(WorkoutsContext)
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchWorkouts = async ()=> {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if(response.ok){
                setWorkouts(json)
            }
        }

        if(user) {
            fetchWorkouts()
        }
        
    }, [user, setWorkouts])

    return(
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => (
                    <WorkoutDetails key={workout._id} workout={workout} />
                ))}
            </div>
            <WorkoutForm />
        </div>
    )
}

export default Home