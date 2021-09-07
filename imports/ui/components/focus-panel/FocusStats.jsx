import React from 'react'

export const FocusStats = ({data}) => {
    return (
        <section>
            <h2>Stats</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
    )
}