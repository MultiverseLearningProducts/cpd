import React, { useEffect, useState, useRef } from 'react'
import { SearchIcon } from './Icons'

export const Search = props => {
    const [term, setTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const searchbox = useRef(null)
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
        searchbox.current.focus()
    }, [term])

    const submitSearch = () => {
        const staffMember = staff.find(({displayName}) => displayName === term)
        setTerm('')
        props.onSelect(staffMember.id)
    }

    const keyControl = e => {
        if (e.key === 'Tab') {
            e.preventDefault()
        } else if (e.key === 'Enter') {
            e.preventDefault()
            submitSearch()
        }
    }

    return (
        <form id="search" className="absolute">
            <input 
                className="w-100 ma2 pa2 pr4 bg-mv-white-dwarf b--transparent"
                style={{borderRadius: '0 0 0 3px'}}
                type="search" 
                ref={searchbox} 
                value={term} 
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={keyControl} />
            <div className="search-icon" onClick={submitSearch}>
                <SearchIcon />
            </div>
            {suggestions.length ? (
                <ol className="pl3">{
                    suggestions.map(({id, displayName}, i) => {
                        return (
                            <li 
                                className="suggestion dib w-90 pa1 mv1 bg-mv-white-dwarf o-60"
                                id={id}
                                key={`${i}-${displayName}`}
                                tabIndex={i + 1}
                                onClick={() => setTerm(displayName)}>{displayName}</li>
                        )
                    })
                }</ol>
            ) : null}
        </form>
    )
}