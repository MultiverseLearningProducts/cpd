import React, { useEffect, useState, useReducer } from 'react'
import { VisNetwork } from './components/VisNetwork'
import { useMethod } from '../both/useMethod'
import { ControlPanel } from './components/ControlPanel'
import { PreviewPanel } from './components/preview-panel/PreviewPanel'
import * as Focus from './components/focus-panel/FocusPanel'
import { Search } from './components/misc/Search'

export const MainContainer = ({user}) => {
    const profiles = useMethod('getProfiles')
    const getEvents = useMethod('getGoogleCalEvents')
    const [selected, setSelected] = useState(null)
    const [network, setNetwork] = useState(null)
    const [previewPanel, setPreviewPanel] = useState(null)
    const [previewPanelCalEvents, setPreviewPanelCalEvents] = useState({})
    const [focusState, focusDispatch] = useReducer(Focus.focusPanelReducer, Focus.focusPanelState)

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
        focusDispatch({type: 'close_focus_panel'})
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
                .then(result => {
                    if (result.status === 'UNAUTHENTICATED') {
                        setPreviewPanelCalEvents({...previewPanelCalEvents, refresh: true})
                    } else {
                        // cache everyone's calendar data in a big hashtable where their email is their key
                        setPreviewPanelCalEvents({...previewPanelCalEvents, [selected.data.email]: result.items, refresh: false} || {})
                    }
                })
                .catch(console.error)
        }
        focusDispatch({type: 'close_focus_panel'})
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
            <Focus.DispatchContext.Provider value={focusDispatch}>
                <Focus.StateContext.Provider value={focusState}>
                    <ControlPanel selected={selected} setPreviewPanel={setPreviewPanel} />
                    <PreviewPanel previewPanel={previewPanel} previewPanelCalEvents={previewPanelCalEvents} />
                    <Focus.Panel selected={selected} />
                </Focus.StateContext.Provider>
            </Focus.DispatchContext.Provider>
        </main>
    )
}