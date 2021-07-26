import React, { useState, useEffect } from 'react'
import { useMethod } from '../../both/useMethod'
import { ObservationsPanel } from './ObservationsPanel'
import { RadarChart } from './RadarChart'
import { FeedbacksPanel } from './FeedbacksPanel'
import { TouchBarH } from './DecorativeElements'

export const NetworkInfoPanel = props => {
    const [open, setOpen] = useState(false)
    const [calEvents, setCalEvents] = useState([])
    const getEvents = useMethod('getGoogleCalEvents')
    const [selectedObs, setSelectedObs] = useState(null)
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
            console.log("isClosing TODO:scrollIntoView", open)
            setSelectedObs(null)
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

    const onSelected = ({observer, observed, calEvt}) => {
        setSelectedObs({observer, observed, calEvt})
    }

    return (
        <aside id="network-info-panel" className={`tc bg-mv-supernova overflow-scroll ${open ? 'open' : 'closed'}`}>
            <nav onClick={toggleOpen}><TouchBarH /></nav>
            <header className="w-100 flex items-center tl">
                <div className="flex-auto pa2 pr5 flex flex-column">
                    <h2 className="mv0">{displayName}</h2>
                    <h3 className="mv0">{title}</h3>
                    <h4 className="mv-atlas f7">{humanize}</h4>
                </div>
                <div className="br-100 flex-none info-panel-avatar" style={{backgroundImage: `url('${avatarUrl || avatar}')`}}></div>
            </header>
            <main id="network-info-panel-main" className="overflow-x-hidden overflow-y-scroll absolute" style={{left: selectedObs ? '-100vw' : '0'}}>
                <section id="panel-1">
                    {props.selected ? <RadarChart selected={props.selected} /> : null}
                    {profiles ? <ObservationsPanel calEvents={calEvents} profiles={profiles} onSelected={onSelected} /> : null}
                </section>
                <section id="panel-2">
                    {selectedObs 
                    ? <FeedbacksPanel selectedObs={selectedObs} setSelectedObs={setSelectedObs}/> 
                    : null}
                </section>
            </main>
        </aside>
    )
}