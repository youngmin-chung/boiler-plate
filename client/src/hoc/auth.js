import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null) {
  // null => all access

  // true => logged in user only

  // false => logged in user denied
  function AuthenticationCheck(props) {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response)

        // not logged in status
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login')
          }
        } else {
          // login status
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/')
          } else {
            if (!option) {
              props.history.push('/')
            }
          }
        }
      })
    }, [])
    return <SpecificComponent />
  }

  return AuthenticationCheck
}
