import React from 'react'

export const Tag = props => {
    const {
        label
    } = props.tag
    return (
        <span className="dib pa1 ba b--mv-molten bg-mv-molten mv-white mr1 br2 lh-copy tc" style={{fontSize: '65%', minWidth: '1.5rem'}}>{label}</span>
    )
}

export const TagCount = props => {
    const {
        label
    } = props.tag
    return <span className="dib pa1 border-box ba b--mv-molten mv-molten mr1 br2 lh-copy tc" style={{fontSize: '65%', minWidth: '1.5rem'}}>{label}</span>
}