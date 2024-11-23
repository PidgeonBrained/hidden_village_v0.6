import "./SignIn.css";
import circle_sprite from "../../assets/circle_sprite.png";
import scaleneTriangle_sprite from "../../assets/scaleneTriangle_sprite.png";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const SignInScreen = ({ firebaseApp }) => {
  const auth = getAuth(firebaseApp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Controls form switch

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login Successful");
        window.location.href = "/"; // Redirect to home
      })
      .catch((error) => {
        setLoginError(true);
        console.error(error);
      });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Account Created Successfully");
        setIsCreatingAccount(false); // Switch back to login form
      })
      .catch((error) => {
        setLoginError(true);
        console.error(error);
      });
  };

  const ErrorMessage = ({ error, message }) =>
    error ? (
      <div className="error-output">
        <span>{message}</span>
        <br />
        <span>Please try again.</span>
      </div>
    ) : null;

  // Render the login form
  const renderLoginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="login">
        <div className="login-inputs">
          <label htmlFor="email" className="login-input-label">Login</label>
          <input
            value={email}
            onChange={handleEmailChange}
            id="email"
            className="login-input-input"
            type="email"
            autoComplete="on"
          />
          <label htmlFor="password" className="login-input-label">Password</label>
          <input
            value={password}
            onChange={handlePasswordChange}
            id="password"
            className="login-input-input"
            type="password"
          />
          <input className="login-input-submit" type="submit" value="SUBMIT" />

          {/* Create Account Button */}
          <button
            type="button"
            className="create-account-button"
            onClick={() => setIsCreatingAccount(true)} // Switch to create account form
          >
            Create Account
          </button>

          <ErrorMessage
            error={loginError}
            message={"Email or password is incorrect."}
          />
        </div>
        <img src={circle_sprite} className="sprite circle-sprite" alt="" />
        <img src={scaleneTriangle_sprite} className="sprite triangle-sprite" alt="" />
      </div>
    </form>
  );

  // Render the create account form
  const renderCreateAccountForm = () => (
    <form onSubmit={handleCreateAccount}>
      <div className="create-account">
        <h2>Create Account</h2>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="create-account-input"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          className="create-account-input"
        />
        <button className="create-account-submit" type="submit">
          Submit
        </button>
        <button
          type="button"
          className="back-to-login-button"
          onClick={() => setIsCreatingAccount(false)} // Switch back to login form
        >
          Back to Login
        </button>

        {/* <ErrorMessage
          error={loginError}
          message={"Unable to create account. Please try again."}
        /> */}
      </div>
    </form>
  );

  // Render the appropriate form based on state
  return (
    <div className="model-loader">
      {isCreatingAccount ? renderCreateAccountForm() : renderLoginForm()}
    </div>
  );
};

export default SignInScreen;
