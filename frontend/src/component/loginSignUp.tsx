import {useState} from "react"
import "../styles/loginSignUp.css";

function LoginSignUp() {

    const [isLogin, setIsLogin] = useState(true);

 return (
    <div className="loginSignUp__overlay">
      <div className="loginSignUp__container">
        
        <h2 className="loginSignUp__title">Welcome to yummies</h2>

        <div className="loginSignUp__tabs">
          <button 
            type="button"
            className={`loginSignUp__tab ${isLogin ? '-active' : ''}`}>
            Login
          </button>
          <button 
            type="button"
            className={`loginSignUp__tab ${!isLogin ? '-active' : ''}`}>
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
          <button type="submit" className="loginSignUp__submit-btn">
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
            className="loginSignUp__google-btn">
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginSignUp