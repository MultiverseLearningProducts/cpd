import React from 'react'

export const FocusCalEvts = ({data}) => {
    return (
        <section>
            <h2>Feedback</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
    )
}