import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [error, setError] = useState(false);
  const RESPONSE_STATUS = {
    FAIL: false,
    SUCCESS: true,
  };
  const submit = async () => {
    try {
      if (
        email.length == 0 ||
        password.length == 0 ||
        username.length == 0 ||
        password2.length == 0 ||
        password != password2 ||
        address.length == 0 ||
        postalcode.length == 0
      ) {
        if (password != password2) {
          alert("you need to math passwords");
        }
        setError(true);
      } else {
        const body = { email, username, password, address, postalcode };
        const result = await fetch("http://localhost:3002/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const bodyPar = await result.json();
        console.log(bodyPar, "bodyPar");
        if (bodyPar.status === 200) {
          console.log("good user and pass");
          window.location.href = "/login";
        } else {
          console.log("u need to change the password ");
          alert("there is something wrong !");
          setError(true);
        }
        if (bodyPar.status === 500) {
          console.log("the two passwords not the same ");
        }
      }
    } catch (err) {
      setError(true);
      console.log("u need to change the password 2 ");
    }
  };

  return (
    <div className="signup">
      <h3 className="titleSignUp">Signup</h3>
      <input
        type="text"
        className="user"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Username"
        name="userName"
      />
      <input
        type="email"
        className="emails"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        name="email"
      />
      <input
        type="password"
        className="passwords"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        name="userPassword"
      />
      <input
        type="password"
        className="passwords"
        onChange={(e) => setPassword2(e.target.value)}
        value={password2}
        placeholder=" Confirm Your Password"
        name="userPassword"
      />
      <input
        type="text"
        className="user"
        onChange={(e) => setAddress(e.target.value)}
        value={address}
        placeholder="Address"
        name="address"
      />
      <input
        type="text"
        className="user"
        onChange={(e) => setPostalcode(e.target.value)}
        value={postalcode}
        placeholder="postalcode"
        name="postalcode"
      />
      <br></br>
      <br></br>
      <button type="button" className="submitSignUp" onClick={submit}>
        Signup
      </button>
      <br></br>
      <Link to="/login">
        <button className="link-btns">Already have account?Click here.</button>
      </Link>
      <br></br>
    </div>
  );
}

export default Signup;
