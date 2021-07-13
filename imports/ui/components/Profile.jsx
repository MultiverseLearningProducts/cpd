import React, { useEffect, useState } from 'react'

export const Profile = props => {
    if (!props.selected) return <main className="pa3">No profile selected</main>
    
    const {
        id,
        displayName,
        avatarUrl,
        about: {
            avatar
        },
        work: {
            title,
            durationOfEmployment: {
                humanize
            }
        }
    } = props.selected.data

    return (
        <main className="pa3">
            <header className="relative">
                <h1 className="mv-supernova">{displayName}</h1>
                <h2 className="mv-white">{title}</h2>
                <div style={{backgroundImage: `url('${avatarUrl || avatar}')`}} className="profile-avatar">
                    <img src="" className="dn" alt={`${displayName}-${title}`} />
                </div>
            </header>
        </main>
    )
}