import React from 'react'

export const Tag = props => {
    const {
        label
    } = props.tag
    return (
        <span className="dib pa1 bg-mv-molten mv-white mr1 br2 lh-copy" style={{fontSize: '65%'}}>{label}</span>
    )
}