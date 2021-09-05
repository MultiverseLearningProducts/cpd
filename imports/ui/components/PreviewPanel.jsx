import React from 'react'

export const PreviewPanel = ({previewPanel, setPreviewPanel}) => {
    return (
        <section id="preview-panel" style={{left: !previewPanel ? '-28rem' : '-2px'}}>
            <h1>{previewPanel}</h1>
        </section>
    )
}