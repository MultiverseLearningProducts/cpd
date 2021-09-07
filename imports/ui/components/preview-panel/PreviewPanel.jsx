import React from 'react'
import { PreviewObservations } from './PreviewObservations'
import { PreviewJournal } from './PreviewJournal'
import { PreviewStats } from './PreviewStats'
import { withTracker } from 'meteor/react-meteor-data'
import { ObservationsCollection } from '../../../db/ObservationsCollection'

const _PreviewPanel_ = props => {
    const { previewPanel } = props
    const heading = previewPanel ? previewPanel.heading : '✦✦✦✦✦'

    return (
        <section id="preview-panel" style={{left: !previewPanel ? '-28rem' : '-2px'}} className="overflow-scroll pb2">
            <h1 className="mt0 mb2">{heading}</h1>
            {heading === 'Observations' ? <PreviewObservations {...props} /> : null}
            {heading === 'Journal' ? <PreviewJournal {...props} /> : null}
            {heading === 'Stats' ? <PreviewStats {...props} /> : null}
        </section>
    )
}

export const PreviewPanel = withTracker(props => {
    if (!props.previewPanel) return {loading: true, observations: []}
    const observationsSub = Meteor.subscribe('observations')
    const loading = !observationsSub.ready()
    const observations = ObservationsCollection.find({
        'observed.email': props.previewPanel.user.data.email
    }, {
        sort: {
            calEvt_date: -1
        }
    }).fetch()
    return { loading, observations }    
})(_PreviewPanel_)

