import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function App() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const callAzureFunction = async () => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const res = await fetch(
        "https://ravijsampath898ytgh.azurewebsites.net/api/HttpTrigger1"
      );
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      const data = await res.text(); // Assuming response is plain text.
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    // Decode token for user information (use jwt-decode library if needed)
    const token = credentialResponse.credential;
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({
      name: payload.name,
      email: payload.email,
      imageUrl: payload.picture,
    });
  };

  const handleLoginError = (error) => {
    console.error("Google Login Failed", error);
    setError("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="826434727827-kf2qevsjr24oe464cce4snf90b46dsnf.apps.googleusercontent.com">
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Azure Function Test with Google Login</h1>
        {!user ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        ) : (
          <div>
            <img
              src={user.imageUrl}
              alt={user.name}
              style={{ borderRadius: "50%", width: "100px" }}
            />
            <h3>Welcome, {user.name}</h3>
            <p>{user.email}</p>
            <button onClick={callAzureFunction} disabled={loading}>
              {loading ? "Loading..." : "Call Azure Function"}
            </button>
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          {response && <p style={{ color: "green" }}>Response: {response}</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
