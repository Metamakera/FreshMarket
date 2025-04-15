import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa"; // Added FaEye and FaEyeSlash

function Auth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [errors, setErrors] = useState({}); // For form validation errors

  // LOGIN FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      fetch("http://localhost:5000/api/buyer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.message === "Login successful") {
            localStorage.setItem("buyerEmail", email);
            navigate("/");
            window.location.reload();
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Login Error:", error);
        });
    }, 3000);
  };

  // REGISTER FUNCTION
  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      fetch("http://localhost:5000/api/buyer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message === "Buyer registered successfully") {
            alert("Registered successfully! Please login.");
            setIsSignup(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
          } else {
            alert(data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Register Error:", err);
        });
    }, 3000);
  };

  const handleSellerRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.open("/seller-register", "_blank");
    }, 3000);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  return (
    <div className="custom-auth-page">
      {loading && (
        <div className="loader-container">
          <div className="wave-loader">
            <span></span> <span></span> <span></span> <span></span> <span></span>
          </div>
        </div>
      )}

      <div className={`custom-auth-wrapper ${isSignup ? "custom-signup-mode" : ""}`}>
        {/* Left Side: Login Form */}
        <div className="custom-auth-container">
          <div className="custom-auth-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="custom-input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="custom-input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <a href="#">Forgot password?</a>
              <button type="submit" className="signin" disabled={loading}>
                Login
              </button>

              <p>
                Don't have an account?{" "}
                <a href="#" onClick={() => setIsSignup(true)}>
                  Signup now
                </a>
              </p>

              <button className="seller-link" onClick={handleSellerRegister} disabled={loading}>
                Become a Seller
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="custom-image-section">
          <div className="custom-overlay">
            <h3>Every new friend is a new adventure</h3>
            <p>Let's get connected</p>
          </div>

          <div className="custom-register-box">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="custom-input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" });
                  }}
                  required
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="custom-input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="custom-input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  required
                />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="custom-input-group">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  required
                />
                <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>

              <div className="custom-remember-me">
                <input type="checkbox" id="custom-remember" />
                <label htmlFor="custom-remember">Remember me</label>
              </div>

              <button type="submit" disabled={loading}>
                Sign Up
              </button>

              <p>
                Already have an account?{" "}
                <a href="#" onClick={() => setIsSignup(false)}>
                  Login now
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;