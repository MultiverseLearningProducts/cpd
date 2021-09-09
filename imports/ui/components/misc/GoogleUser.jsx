import React from 'react'
import { Link } from 'react-router-dom'

export const GoogleUser = ({ user }) => {
    if(!user && !user.services && !user.services.google) return <div></div>
    return (
        <span className="dib bg-mv-supernova pa2 flex items-center" style={{ borderRadius: '0px 0px 0px 26px' }}>
            <img className="br-100 mr2" src={user.services.google.picture} width="47px" />
            <label>{user.profile.name.split(' ')[0]}</label>
            <nav className="ml2">
                <Link to="/sign-out">
                    <svg className="br3 pa1 shadow-4" width="27px" height="27px" viewBox="0 0 47 47" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <title>signout</title>
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g fill="#242456" fillRule="nonzero">
                                <path d="M11.75,27.4166667 L35.25,27.4166667 C35.5406167,27.4166667 35.80695,27.2560833 35.9424667,26.99915 C36.0787667,26.743 36.06075,26.4320167 35.8970333,26.1923167 L24.1470333,8.95898333 C23.85485,8.5305 23.14515,8.5305 22.8529667,8.95898333 L11.1029667,26.1923167 C10.93925,26.4328 10.9220167,26.743 11.0575333,26.99915 C11.19305,27.2560833 11.4593833,27.4166667 11.75,27.4166667 Z M23.5,10.7904167 L33.76715,25.85 L13.23285,25.85 L23.5,10.7904167 Z"></path>
                                <path d="M23.5,0 C10.5421,0 0,10.5421 0,23.5 C0,36.4579 10.5421,47 23.5,47 C36.4579,47 47,36.4579 47,23.5 C47,10.5421 36.4579,0 23.5,0 Z M23.5,45.4333333 C11.4061167,45.4333333 1.56666667,35.5938833 1.56666667,23.5 C1.56666667,11.4061167 11.4061167,1.56666667 23.5,1.56666667 C35.5938833,1.56666667 45.4333333,11.4061167 45.4333333,23.5 C45.4333333,35.5938833 35.5938833,45.4333333 23.5,45.4333333 Z"></path>
                                <path d="M10.9666667,35.25 L36.0333333,35.25 L36.0333333,29.7666667 L10.9666667,29.7666667 L10.9666667,35.25 Z M12.5333333,31.3333333 L34.4666667,31.3333333 L34.4666667,33.6833333 L12.5333333,33.6833333 L12.5333333,31.3333333 Z"></path>
                            </g>
                        </g>
                    </svg>
                </Link>
            </nav>
            {user.services.google.email === 'bernard.mordan@multiverse.io' ? (
                <button className="b--transparent bg-transparent" onClick={() => Meteor.call('getNetworkData')}>🔄</button>
            ) : null}
        </span>
    )
}