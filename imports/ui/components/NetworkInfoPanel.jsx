import React, { useState, useEffect, useReducer } from 'react'
import { useMethod } from '../../both/useMethod'
import { ObservationsPanel } from './ObservationsPanel'
import { RadarChart } from './RadarChart'

export const NetworkInfoPanel = props => {
    const [open, setOpen] = useState(false)
    const [calEvents, setCalEvents] = useState([])
    const getEvents = useMethod('getGoogleCalEvents')
    const {
        selected: {
            data: {
                id,
                displayName,
                firstName,
                avatarUrl,
                email,
                work: {
                    title,
                    directReports,
                    durationOfEmployment: {
                        humanize
                    }
                },
                about: {
                    avatar
                }
            }
        },
        profiles
    } = props

    const toggleOpen = () => {
        if (open) {
            console.log("isClosing", open)
        }
        setOpen(!open)
    }

    useEffect(() => {
        getEvents.call(email)
            .then(({items}) => {
                if (items) setCalEvents(items)
            })
            .catch(console.error)
    }, [props.selected])
    return (
        <aside id="network-info-panel" onClick={toggleOpen} className={`tc bg-mv-supernova overflow-scroll ${open ? 'open' : 'closed'}`}>
            <svg width="127px" height="7px" viewBox="0 0 127 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <title>Rectangle</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle" fill="#D9C249" x="0" y="0" width="127" height="7" rx="3.5"></rect>
                </g>
            </svg>
            <header className="w-100 flex items-center tl">
                <div className="flex-auto pa2 pr5 flex flex-column">
                    <h2 className="mv0">{displayName}</h2>
                    <h3 className="mv0">{title}</h3>
                    <h4 className="mv-atlas f7">{humanize}</h4>
                </div>
                <div className="br-100 flex-none info-panel-avatar" style={{backgroundImage: `url('${avatarUrl || avatar}')`}}></div>
            </header>
            <main>
                {props.selected ? <RadarChart selected={props.selected} /> : null}
                {profiles ? <ObservationsPanel calEvents={calEvents} profiles={profiles} /> : null}
            </main>
        </aside>
    )
}