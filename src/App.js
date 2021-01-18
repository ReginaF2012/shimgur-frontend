import "./App.css";
import { useState, useEffect } from "react";

function App() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loggedIn, toggleLogIn] = useState(false);
    const [isSignUp, toggleSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) handleSignUp(user);
        else handleLogIn(user);

        // setUser({
        //     username: "",
        //     email: "",
        //     password: "",
        //     password_confirmation: "",
        // });
    };

    const handleLogIn = () => {
        const data = {
            user: {
                username: user.username,
                email: user.email,
                password: user.password,
            },
        };

        fetch("http://localhost:3001/api/v1/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data", data);
                if (data.user) {
                    setUser({
                        ...data.user,
                    });
                    toggleLogIn(true);
                }
            })
            .catch((errors) => alert(errors));
    };

    const handleSignUp = () => {
        fetch("http://localhost:3001/api/v1/users", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.user) {
                    console.log("data", data);
                    setUser({
                        ...data.user,
                    });
                    toggleLogIn(true);
                }
            })
            .catch((errors) => alert(errors));
    };

    const handleLogOut = () => {
        fetch("http://localhost:3001/api/v1/logout", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                if (data.logged_out === true) {
                    setUser({
                        username: "",
                        email: "",
                        password: "",
                        password_confirmation: "",
                    });

                    toggleLogIn(false);
                }
            })
            .catch((errors) => alert(errors));
    };

    const autoLogin = () => {
        fetch("http://localhost:3001/api/v1/logged_in", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
              console.log(data)
                // if (data.logged_in) {
                //     setUser({ ...data.user });
                //     toggleLogIn(true);
                // } else {
                //     setUser({
                //         username: "",
                //         email: "",
                //         password: "",
                //         password_confirmation: "",
                //     });
                //     toggleLogIn(false);
                // }
            });
    };

    useEffect(() => {
        autoLogin();
    });

    const handleOnChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <>
            {loggedIn ? <h1>{user.username}</h1> : <h1>No user...</h1>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label for="username">Username</label>
                    <input
                        onChange={handleOnChange}
                        defaultValue={user.username}
                        name="username"
                        type="text"
                    />
                </div>
                <div>
                    <label for="email">Email</label>
                    <input
                        onChange={handleOnChange}
                        defaultValue={user.email}
                        name="email"
                        type="email"
                    />
                </div>
                <div>
                    <label for="password">Password</label>
                    <input
                        onChange={handleOnChange}
                        defaultValue={user.password}
                        name="password"
                        type="password"
                    />
                </div>

                {isSignUp && (
                    <div>
                        <label for="password_confirmation">Password Conf</label>
                        <input
                            onChange={handleOnChange}
                            defaultValue={user.password_confirmation}
                            name="password_confirmation"
                            type="password"
                        />
                    </div>
                )}
                <button type="submit">CLICCCK</button>
            </form>
            {isSignUp ? (
                <button
                    onClick={() => {
                        toggleSignUp(!isSignUp);
                        setUser({ ...user, password_confirmation: "" });
                    }}
                >
                    Login
                </button>
            ) : (
                <button onClick={() => toggleSignUp(!isSignUp)}>Sign Up</button>
            )}
            {loggedIn && (
                <button onClick={handleLogOut}>Log the fuck out</button>
            )}
        </>
    );
}

export default App;
