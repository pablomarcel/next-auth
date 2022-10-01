import { useContext, useEffect, useState } from 'react'
import styles from '../styles/Guides.module.css'
import AuthContext from '../stores/authContext'

export default function Phrases() {
  const { user, authReady, login } = useContext(AuthContext)
  const [phrases, setPhrases] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authReady) {
      fetch('/.netlify/functions/phrases', user && {
        headers: {
          Authorization:  'Bearer ' + user.token.access_token
        }
      })
      .then(res => {
        if (!res.ok) {
          login()
          throw Error('You must be logged in to view this content')
        }
        return res.json()
      })
      .then(data => {
        setError(null)
        setPhrases(data)
      })
      .catch(err => {
        setError(err.message)
        setPhrases(null)
      })
    }

  },[user, authReady])

  return (
    <div className={styles.guides}>

      {!authReady && <div>Loading...</div>}

      {error && (
        <div className={styles.error}>
          <p>{ error }</p>
        </div>
      )}

      {phrases && phrases.map(phrase => (
        <div key={phrase.title} className={styles.card}>
          <h3>{ phrase.title }</h3>
          <h4>Company: {phrase.load}</h4>
          <p>State: {phrase.reps}</p>

        </div>
      ))}

    </div>
  )
}
