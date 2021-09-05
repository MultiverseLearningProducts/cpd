import React, { useEffect, useState } from 'react'
import { VisNetwork } from './components/VisNetwork'
import { useMethod } from '../both/useMethod';
import { ControlPanel } from './components/ControlPanel';
import { PreviewPanel } from './components/PreviewPanel';

export const MainContainer = ({user}) => {
    const profiles = useMethod('getProfiles')
    const [selected, setSelected] = useState(null)
    const [network, setNetwork] = useState(null)
    const [previewPanel, setPreviewPanel] = useState(null)
    
    const onSelect = id => {
        if (!profiles.data) return
        const selected = profiles.data.nodes.find(p => p.id === id)
        setSelected(selected)
    }

    useEffect(() => {
        profiles.call()
    }, [])

    useEffect(() => {
        if (!selected) {
            setPreviewPanel(null)
        }
    }, [selected])

    useEffect(() => {
        if (!network || !profiles.data) return
        const profile = profiles.data.nodes.find(p => p.data.email === user.services.google.email)
        network.setSelection({nodes: [profile.id]})
        Meteor.setTimeout(() => {
            network.focus(profile.id, {scale: 0.8})
            setSelected(profile)
        }, 1800)
    }, [network])

    return (
        <main id="main-container">
            {profiles.data ? <VisNetwork onSelect={onSelect} data={profiles.data} setNetwork={setNetwork} /> : null}
            <ControlPanel selected={selected} setPreviewPanel={setPreviewPanel} />
            <PreviewPanel previewPanel={previewPanel} setPreviewPanel={setPreviewPanel} />
        </main>
    )
}