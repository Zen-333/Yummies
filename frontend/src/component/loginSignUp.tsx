import {useState} from "react"
import "../styles/loginSignUp.css";
import { useAuth } from "../context/AuthContext"

function LoginSignUp() {

    const [isLogin, setIsLogin] = useState(true);
    const {signInWithGoogle} = useAuth()

    const onLogin = () => 
    {

    }

    const setLoginActive = () => {
      setIsLogin(true);
    }

    const setDeactivateLogin = () => {
      setIsLogin(false);
    }

 return (
    <div className="loginSignUp__overlay">
      <div className="loginSignUp__container">
        
        <h2 className="loginSignUp__title">Welcome to yummies</h2>

        <div className="loginSignUp__tabs">
          <button 
            type="button"
            className={`btn--secondary btn ${isLogin ? 'active' : ''}`} onClick={setLoginActive}>
            Login
          </button>
          <button 
            type="button"
            className={`btn--secondary btn ${!isLogin ? 'active' : ''}`} onClick={setDeactivateLogin}>
            Sign Up
          </button>
        </div>

        <form className="loginSignUp__form">
          <div className="loginSignUp__form-group">
            <label htmlFor="loginSignUp__username">Username</label>
            <input 
              id="loginSignUp__username" 
              type="text" 
              placeholder="Enter your username" 
              required 
            />
          </div>

          <div className="loginSignUp__form-group">
            <label htmlFor="loginSignUp__password">Password</label>
            <input 
              id="loginSignUp__password" 
              type="password" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          {/* Primary Submit Button */}
          <button type="submit" className="btn--primary btn" onClick={onLogin}>
            Login
          </button>
        </form>

        {/* 4. THIRD-PARTY ZONE: Social Logins */}
        <div className="loginSignUp__oauth-section">
          <div className="loginSignUp__separator">
            <span>or</span>
          </div>
          <button 
            type="button" 
            className="btn--secondary btn"
            onClick={signInWithGoogle}>
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginSignUp