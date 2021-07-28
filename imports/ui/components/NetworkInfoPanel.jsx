import React, { useState, useEffect } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { useMethod } from '../../both/useMethod'
import { ObservationsPanel, ObsFeedbacks } from './ObservationsPanel'
import { RadarChart } from './RadarChart'
import { FeedbacksPanel } from './FeedbacksPanel'
import { TouchBarH } from './DecorativeElements'
import { ObservationsCollection } from '../../db/ObservationsCollection'

export const NetworkInfo = props => {
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
                console.info(`${items && items.length} new cal items`)
                setCalEvents(items || [])
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
            <main id="network-info-panel-main" className="overflow-x-hidden overflow-y-scroll">
                <section id="panel-1" className={`absolute ${selectedObs ? 'off-screen' : 'in-screen'}`}>
                    {props.selected ? (
                        <div className="ph2 flex flex-column tl justify-start">
                            <RadarChart selected={props.selected} />
                            {props.observations.length ? (
                                <section className="bg-mv-white-dwarf bg-lined-paper pa4">
                                    <h2 className="tr">Observations Log</h2>
                                    {props.observations.map(ob => <ObsFeedbacks key={ob._id} observation={ob} />)}
                                </section>
                            ) : null}
                        </div>
                    ) : null}
                    {profiles ? <ObservationsPanel calEvents={calEvents} profiles={profiles} onSelected={onSelected} /> : null}
                </section>
                <section id="panel-2" className={`absolute ${selectedObs ? 'in-screen' : 'off-screen'}`} >
                    {selectedObs 
                    ? <FeedbacksPanel selectedObs={selectedObs} setSelectedObs={setSelectedObs}/> 
                    : null}
                </section>
            </main>
        </aside>
    )
}

export const NetworkInfoPanel = withTracker(props => {
    const observationsSub = Meteor.subscribe('observations')
    const loading = !observationsSub.ready()
    const observations = ObservationsCollection.find({
        'observed.email': props.selected.data.email
    }, {
        sort: {
            calEvt_date: -1
        }
    }).fetch()
    return { loading, observations }
})(NetworkInfo)
