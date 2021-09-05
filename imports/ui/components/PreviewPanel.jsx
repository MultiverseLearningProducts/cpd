import React from 'react'

export const PreviewPanel = ({previewPanel, setPreviewPanel}) => {
    const glimmer = {
        isGlimmer: true,
        heading: '✦✦✦✦✦'
    }
    const {
        isGlimmer = false,
        heading
    } = previewPanel ? previewPanel : glimmer
    return (
        <section id="preview-panel" style={{left: isGlimmer ? '-28rem' : '-2px'}}>
            <h1>{heading}</h1>
        </section>
    )
}