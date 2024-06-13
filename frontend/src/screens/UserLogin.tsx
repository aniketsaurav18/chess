import "./UserLogin.css";

const UserLogin = () => {
  return (
    <main className="userlogin">
      <form action="" className="login-form">
        <h1>Login</h1>
        <div className="login-element">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="login-element">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <p>
          New Player? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </main>
  );
};

export default UserLogin;
