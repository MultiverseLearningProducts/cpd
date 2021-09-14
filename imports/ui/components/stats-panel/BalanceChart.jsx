import React from 'react'

export const BalanceChart = ({data: {email, observations}}) => {
    const [given, received] = observations.reduce((memo, ob) => {
        if (ob.observer.email === email) memo[0]++
        if (ob.observed.email === email) memo[1]++
        return memo
    }, [0, 0])
    // if its zero default to 50/50
    const balance = (given === 0 && received === 0) ? 50 : Math.round(given/(given+received) * 100) 
    return (
        <div className="w-100 h2 br3 bg-mv-molten flex items-center justify-start pr2">
            <span className="mv-white dib h2 bg-mv-aurora flex items-center flex-none pl2" style={{borderRadius: '.5rem 0 0 .5rem', width: `${balance}%`}}>Given {given}</span>
            <span className="mv-white dib justify-end flex-auto tr pr2">Received {received}</span>
        </div>
    )
}