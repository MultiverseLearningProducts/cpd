import React, { useEffect, useState } from 'react'
import { SearchIcon } from './Icons'

export const Search = props => {
    const [term, setTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const staff = props.profiles.map(({data: {id, displayName}}) => ({id, displayName})) 

    useEffect(() => { 
        const suggestions = staff.filter(({displayName}) => {
            if (!term) return false
            return new RegExp(`^${term}|\.+\s${term}`, 'ig').test(displayName)
        })
        if(suggestions[0] 
            && suggestions[0].displayName 
            && (suggestions[0].displayName === term
            || term === '')) {
            setSuggestions([])
        } else {
            setSuggestions(suggestions)
        }
    }, [term])

    const submitSearch = () => {
        const staffMember = staff.find(({displayName}) => displayName === term)
        setTerm('')
        props.onSelect(staffMember.id)
    }

    return (
        <form id="search" className="absolute">
            <input className="w-100 mr2 pa2 pr4 bg-mv-white-dwarf b--transparent" type="search" value={term} onChange={(event) => setTerm(event.target.value)} />
            <div className="search-icon" onClick={submitSearch}>
                <SearchIcon />
            </div>
            <section className="pt1">{
                suggestions.map(({id, displayName}, i) => {
                    return (
                        <span className="suggestion dib w-90 pa1 mv1 bg-mv-white-dwarf o-60" key={`${i}-${displayName}`} onClick={() => setTerm(displayName)}>{displayName}</span>
                    )
                })
            }</section>
        </form>
    )
}