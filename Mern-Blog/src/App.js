import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage/AuthPage'
import HomePage from './pages/HomePage/HomePage'
import ShowPage from './pages/ShowPage/ShowPage'
import { Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'

export default function App(){
    const [user, setUser] = useState(null)
    const [token, setToken] = useState('')

    const signUp = async (credentials) => {
        try {
           const response  =  await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
           })
           const data = await response.json()
           setUser(data.user)
           setToken(data.token)
           localStorage.setItem('token', data.token)
        } catch (error) {
           console.error(error) 
        }
        const login = async (credentials) => {

            try {
            // https://i.imgur.com/3quZxs4.png
            // Step 1 is complete here once someone fills out the loginForm
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(credentials)
            })
            const data = await response.json()
            // Step 3
            const tokenData = data.token 
            localStorage.setItem('token', tokenData)
            setToken(tokenData)
            // the below code is additional to the core features of authentication
            // You need to decide what additional things you would like to accomplish when you
            // set up your stuff
            const userData = data.user
            localStorage.setItem('user', userData)
            setUser(userData)
            } catch (error) {
                console.error(error)
            }
            
        }
       
        const createdBlog = async (blogData, token) => {
            //https://i.imgur.com/3quZxs4.png
            //Step4
            if (!token) {
                return
            }
            try {
                const respone = await fetch('/api/blogs',  {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }, 
                    body: JSON.stringify(blogData)
                })
                const data = await respone.json
                return data
            } catch (error) {
                console.error(error)
            }
        }
    }

    return(
        <div className={styles.App}>
            <Routes>
                <Route path="/" element={<HomePage user={user} token={token} setToken={setToken}/>}></Route>
                <Route path="/register" element={<AuthPage setUser={setUser} setToken={setToken} signUp={signUp}/>}></Route>
                <Route path="/blog" element={<ShowPage user={user} token={token} setToken={setToken}/>}></Route>
            </Routes>
        </div>
    )
}