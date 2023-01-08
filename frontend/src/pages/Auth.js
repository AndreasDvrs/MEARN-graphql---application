import React, { useContext, useRef, useState } from 'react';
import authContext from '../context/auth-context';
import "./Auth.css"

const AuthPage = () => {
    let emailRef = useRef(null);
    let passwordRef = useRef(null);

    const [isLogin, setIsLogin] = useState(true);

    const context = useContext(authContext);

    const onSwitchMode = () => {
        setIsLogin(!isLogin);
    }

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
            if (email.trim().length === 0 || password.trim().length === 0) {
                return;
            }
            let requestBody = {
                query: `
                    query LoginUser ($email: String!, $password: String!) {
                        login(email: $email , password: $password)
                        {userId, token, tokenExpiration}
                    }
                `,
                variables: {
                    email, password
                }
            };
            if (!isLogin) {
                requestBody = {
                    query: `
                        mutation CreateUser ($email: String!, $password: String!) {
                            createUser(userInput: {email: $email, password: $password}) {_id email}
                        }
                    `,
                    variables: {
                        email, password
                    }
                };
            }
            const res = await fetch (
                'http://localhost:8080/graphql', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            let actualData = await res.json();
            if (actualData?.data?.login?.token) {
                context.login(
                    actualData.data.login.token, 
                    actualData.data.login.userId, 
                    actualData.data.login.tokenExpiration
                )
            }    
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-control">
                <label form="email">E-mail</label>
                <input type="email" id="email" ref={emailRef}/>
            </div>
            <div className="form-control">
                <label form="password">Password</label>
                <input type="password" id="password" ref={passwordRef}/>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={onSwitchMode}> Switch to {isLogin ? 'Signup' : 'Login'} </button>
            </div>

        </form>
    )
}

export default AuthPage;
