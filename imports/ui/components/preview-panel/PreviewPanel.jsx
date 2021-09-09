import React, { useContext, useEffect } from 'react'
import { PreviewObservations } from './PreviewObservations'
import { PreviewJournal } from './PreviewJournal'
import { PreviewStats } from './PreviewStats'
import { withTracker } from 'meteor/react-meteor-data'
import { ObservationsCollection } from '../../../db/ObservationsCollection'
import { DispatchContext } from '../focus-panel/FocusPanel'

const _PreviewPanel_ = props => {
    const dispatch = useContext(DispatchContext)
    const { previewPanel, loading, observations } = props
    const heading = previewPanel ? previewPanel.heading : '✦✦✦✦✦'
    
    useEffect(() => {
        if (heading === 'Journal' && !loading) {
            const journals = observations.filter(ob => {
                return previewPanel.user.data.email === ob.observed.email && ob.reflection && ob.feedback
            })
            dispatch({
                type: 'open_focus_panel',
                heading: 'Reflections and Insights Journal',
                content: journals,
                scrollTo: null
            })
        } else {
            dispatch({type: 'close_focus_panel'})
        }
    }, [previewPanel, observations, loading])

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
    const observations = ObservationsCollection.find({}, {
        sort: {
            calEvt_date: -1
        }
    }).fetch()
    return { loading, observations }    
})(_PreviewPanel_)

