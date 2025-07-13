import React from 'react'
import { useAuth } from '../context/AuthContext'
import UpdateProfileImage from "../components/UpdateProfileImage"


function Profile() {

  const {user, profileImage} = useAuth();
 
  return (
    <div>
      
    </div>
  )
}

export default Profile
