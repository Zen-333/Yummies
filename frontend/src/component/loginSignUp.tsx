import { useState, useRef } from "react"
import "../styles/loginSignUp.css"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faCamera } from "@fortawesome/free-solid-svg-icons"

interface LoginSignUpProps {
    onClose: () => void
}

function LoginSignUp({ onClose}: LoginSignUpProps) {

    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const avatarInputRef = useRef<HTMLInputElement>(null)

    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

    const switchTab = (login: boolean) => {
        setIsLogin(login)
        setError(null)
        setEmail("")
        setPassword("")
        setAvatarFile(null)
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview)
            setAvatarPreview(null)
        }
    }

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
        e.target.value = ""
    }

    const handleSubmit = async () => {
        setError(null)

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.")
            return
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }

        setIsLoading(true)

        if (isLogin) {
            const errorMsg = await signInWithEmail(email, password)
            if (errorMsg) {
                setError(errorMsg)
                setIsLoading(false)
                return
            }
        } else {
            const errorMsg = await signUpWithEmail(email, password, avatarFile ?? undefined)
            if (errorMsg) {
                setError(errorMsg)
                setIsLoading(false)
                return
            }
        }

        setIsLoading(false)
        onClose()
    }

    return (
        <div className="loginSignUp__overlay" onClick={onClose}>
            <div className="loginSignUp__container" onClick={(e) => e.stopPropagation()}>

                <div className="loginSignUp__header">
                    <h2 className="loginSignUp__title">Welcome to Yummies</h2>
                    <button className="btn btn--icon loginSignUp__close" onClick={onClose}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>

                <div className="loginSignUp__tabs">
                    <button
                        type="button"
                        className={`loginSignUp__tab ${isLogin ? 'loginSignUp__tab--active' : ''}`}
                        onClick={() => switchTab(true)}>
                        Login
                    </button>
                    <button
                        type="button"
                        className={`loginSignUp__tab ${!isLogin ? 'loginSignUp__tab--active' : ''}`}
                        onClick={() => switchTab(false)}>
                        Sign Up
                    </button>
                </div>

                <div className="loginSignUp__body">

                    {!isLogin && (
                        <div className="loginSignUp__avatar-section">
                            <div
                                className="loginSignUp__avatar-circle"
                                onClick={() => avatarInputRef.current?.click()}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar preview" className="loginSignUp__avatar-img" />
                                ) : (
                                    <FontAwesomeIcon icon={faCamera} className="loginSignUp__avatar-icon" />
                                )}
                            </div>
                            <p className="loginSignUp__avatar-label">Profile photo (optional)</p>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarPick}
                            />
                        </div>
                    )}

                    <div className="loginSignUp__form-group">
                        <label htmlFor="loginSignUp__email">Email</label>
                        <input
                            id="loginSignUp__email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="loginSignUp__form-group">
                        <label htmlFor="loginSignUp__password">Password</label>
                        <input
                            id="loginSignUp__password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
                        />
                    </div>

                    {/* Error message */}
                    {error && <p className="loginSignUp__error">{error}</p>}

                    <button
                        type="button"
                        className="btn btn--primary loginSignUp__submit"
                        onClick={handleSubmit}
                        disabled={isLoading}>
                        {isLoading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
                    </button>

                    <div className="loginSignUp__separator">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn--secondary loginSignUp__google"
                        onClick={signInWithGoogle}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="loginSignUp__google-icon"
                        />
                        Continue with Google
                    </button>

                </div>
            </div>
        </div>
    )
}

export default LoginSignUp