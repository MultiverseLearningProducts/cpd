import React, { useEffect, useState } from 'react'
import { VisNetwork } from './components/VisNetwork'
import { useMethod } from '../both/useMethod'
import { ControlPanel } from './components/ControlPanel'
import { PreviewPanel } from './components/preview-panel/PreviewPanel'
import { Search } from './components/misc/Search'

export const MainContainer = ({user}) => {
    const profiles = useMethod('getProfiles')
    const getEvents = useMethod('getGoogleCalEvents')
    const [selected, setSelected] = useState(null)
    const [network, setNetwork] = useState(null)
    const [previewPanel, setPreviewPanel] = useState(null)
    const [previewPanelCalEvents, setPreviewPanelCalEvents] = useState({})

    const onSelect = id => {
        if (!profiles.data) return
        const selected = profiles.data.nodes.find(p => p.id === id)
        setSelected(selected)
    }

    useEffect(() => {
        profiles.call()
    }, [])

    useEffect(() => {
        setPreviewPanel(null)
        if (selected) {
            network.setSelection({nodes: [selected.id]})
            network.focus(selected.id, {
                scale: 0.8,
                animation: {
                    duration: 200
                }
            })
        }
    }, [selected])

    useEffect(() => {
        if(!selected) return
        if(!(selected.data.email in previewPanelCalEvents)) {
            getEvents.call(selected.data.email)
                .then(({items}) => {
                    // cache everyone's calendar data in a big hashtable where their email is their key
                    console.info(`fetched ${items.length} google calendar events for ${selected.data.email}`)
                    setPreviewPanelCalEvents({[selected.data.email]: items} || {})
                })
                .catch(console.error)
        }
    }, [previewPanel])

    useEffect(() => {
        if (!network || !profiles.data) return
        const profile = profiles.data.nodes.find(p => p.data.email === user.services.google.email)
        Meteor.setTimeout(() => setSelected(profile), 1800)
    }, [network])

    return (
        <main id="main-container">
            {profiles.data ? <Search profiles={profiles.data.nodes} onSelect={onSelect} /> : null}   
            {profiles.data ? <VisNetwork onSelect={onSelect} data={profiles.data} setNetwork={setNetwork} /> : null}
            <ControlPanel selected={selected} setPreviewPanel={setPreviewPanel} />
            <PreviewPanel previewPanel={previewPanel} previewPanelCalEvents={previewPanelCalEvents} />
        </main>
    )
}