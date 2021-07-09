import React from 'react'
import { Link } from 'react-router-dom'

export const GoogleUser = ({user}) => {
    return  (
        <span className="dib bg-mv-supernova pa2 flex items-center" style={{borderRadius: '0px 0px 0px 26px'}}>
            <img className="br-100 mr2" src={user.services.google.picture} width="47px"/>
            <label>{user.profile.name}</label>
            <nav className="ml2"><Link to="/sign-out">Sign out</Link></nav>
        </span>
    )
}