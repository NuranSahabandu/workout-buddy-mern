import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

export const useUpdateProfile = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [success, setSuccess] = useState(false)
    const { user, dispatch } = useAuthContext()

    const updateProfile = async ({ name, email, currentPassword, newPassword }) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ name, email, currentPassword, newPassword })
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if (response.ok) {
            const updatedUser = { ...user, ...json }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            dispatch({ type: 'UPDATE_USER', payload: json })
            setIsLoading(false)
            setSuccess(true)
        }
    }

    return { updateProfile, isLoading, error, success }
}
