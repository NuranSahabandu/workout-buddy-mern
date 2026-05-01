import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useUpdateProfile } from "../hooks/useUpdateProfile"

const Profile = () => {
    const { user } = useAuthContext()
    const { updateProfile, isLoading, error, success } = useUpdateProfile()

    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        if (success) {
            setCurrentPassword('')
            setNewPassword('')
        }
    }, [success])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateProfile({ name, email, currentPassword, newPassword })
    }

    return (
        <form className="profile" onSubmit={handleSubmit}>
            <h3>Your Profile</h3>

            <label>Display Name:</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Optional display name"
            />

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Current Password:</label>
            <input
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                placeholder="Required only when changing email or password"
            />

            <label>New Password:</label>
            <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Leave blank to keep current password"
            />

            <button disabled={isLoading}>Save Changes</button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">Profile updated successfully!</div>}
        </form>
    )
}

export default Profile
