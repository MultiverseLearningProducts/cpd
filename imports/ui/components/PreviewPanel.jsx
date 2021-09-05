import React from 'react'
import { PreviewObservations } from './ObservationsPreview'

export const PreviewPanel = props => {
    const { previewPanel } = props
    const heading = previewPanel ? previewPanel.heading : '✦✦✦✦✦'
    return (
        <section id="preview-panel" style={{left: !previewPanel ? '-28rem' : '-2px'}} className="overflow-scroll pb2">
            <h1 className="mt0 mb2">{heading}</h1>
            {heading === 'Observations' ? <PreviewObservations {...props} /> : null}
        </section>
    )
}

