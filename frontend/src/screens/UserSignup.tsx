import "./UserSignup.css";

const UserSignup = () => {
  return (
    <main className="userlogin">
      <form action="" className="signup-form">
        <h1>Sign Up</h1>
        <div className="signup-element">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="signup-element">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="signup-element">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="signup-element">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
};

export default UserSignup;
