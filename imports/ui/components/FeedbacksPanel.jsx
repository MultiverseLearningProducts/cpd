import React, { useState, useEffect } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import parse from 'html-react-parser'
import { ObsAvatars } from './ObservationsPanel'
import { TouchBarV } from './DecorativeElements'
import { Editor } from './Editor'
import { ObservationsCollection } from '../../db/ObservationsCollection'

const Feedbacks = props => {
    if (!props.selectedObs) return null
    const [feedback, setFeedback] = useState("")
    const {
        observer,
        observed,
        calEvt
    } = props.selectedObs
    const touchBarStyles = {
        position: 'fixed',
        left: '8px',
        top: '50%',
    }
    const submitFeedback = () => {
        const newFeedbackThread = {
            calEvt_id: calEvt.id,
            calEvt_date: calEvt.start.dateTime,
            observer: observer.data.email,
            observed: observed.data.email,
            reflection: feedback,
            feedbacks: [],
            tags: [],
            statusCode: 0
        }
        ObservationsCollection.insert(newFeedbackThread, (err) => {
            err ? console.error(`an observation for ${calEvt.start.dateTime} has already been created`) : null
            setFeedback("")
        })
    }

    if (props.loading) return <article className="pa2 pt4">Loading...</article>

    const { observation }  = props

    const figurePrompt = ({statusCode = 0}) => {
        return [
            "You need to leave a reflection",
            `${observer.data.firstName} needs to leave you some feedback`,
            `What do you think about that feedback? Respond to ${observer.data.firstName}?`
        ][statusCode]
    }

    return (
        <article className="pa2 pt4">
            <nav style={touchBarStyles} onClick={event => { event.stopPropagation(); props.setSelectedObs(null) }}><TouchBarV /></nav>
            <ObsAvatars observer={observer} observed={observed} />
            <h2>{figurePrompt(observation || {})}</h2>
            {observation ? <section className="bg-mv-white-dwarf pa2 ma2 tl">{parse(observation.reflection)}</section> : null}
            <Editor
                name="feedback"
                defaultValue={feedback}
                onChange={setFeedback}
                placeholder="Pick out elements of the Rubric that you observed. Add any other feedback you think will help your fellow coach to be even more awesome!" />
            <section className="flex justify-end ph2">
                <button 
                className="mt2 bg-mv-molten mv-white shadow-4 pa2 br3 b--transparent" 
                onClick={event => {event.stopPropagation();submitFeedback()}}>Add Feedback</button>
            </section>
        </article>
    )
}

export const FeedbacksPanel = withTracker(({ selectedObs }) => {
    const observationsSub = Meteor.subscribe('observations', selectedObs.calEvt.id)
    const loading = !observationsSub.ready()
    const [observation] = ObservationsCollection.find({}, {where: {calEvt: {$eq: selectedObs.calEvt.id}}}).fetch()
    return { loading, observation }
})(Feedbacks)