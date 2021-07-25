import React, { useState, useEffect } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import parse from 'html-react-parser'
import { ObsAvatars } from './ObservationsPanel'
import { TouchBarV } from './DecorativeElements'
import { Editor } from './Editor'
import { ObservationsCollection } from '../../db/ObservationsCollection'
import { CoachRubricTags } from './CoachRubricTags'

class Observation {
    constructor(obs) {
        Object.assign(this, {
            calEvt_id: null,
            calEvt_date: null,
            observer: null,
            observed: null,
            reflection: "",
            private_reflection: "",
            feedback: "",
            private_feedback: "",
            feedbacks: [],
            tags: []
        }, obs)
    }
}

const Feedback = ({ HTMLcontent, email, avatar }) => {
    return (
        <section className="bg-mv-white-dwarf bg-lined-paper pl6 pv2 ma2 tl ml-auto mr-auto mw7 relative">
            {parse(HTMLcontent)}
            <article className="absolute flex justify-end items-center bottom--1 right--1">
                <small className="dib mr2 tr pb2"><a href={`mailto:${email}`}>{email}</a></small>
                <div className="br-100 flex-none feedback-panel-avatar" style={{ backgroundImage: `url('${avatar}')` }}></div>
            </article>
        </section>
    )
}

const FeedbackBtn = ({label = 'Add Feedback'}) => {
    
}

const Feedbacks = props => {
    if (!props.selectedObs) return null
    const [feedback, setFeedback] = useState("")
    const [tags, setTags] = useState([])
    const user = Meteor.user()

    const {
        observer,
        observed,
        calEvt
    } = props.selectedObs

    const [
        isObserver,
        isObserved,
        isGuest
    ] = [
            user.services.google.email === observer.data.email,
            user.services.google.email === observed.data.email,
            user.services.google.email !== observer.data.email &&
            user.services.google.email !== observed.data.email
        ]

    if (props.loading) return <article className="pa2 pt4">Loading...</article>

    const { observation } = props

    const submitObservation = (first_feedback) => {
        const obs = new Observation({
            calEvt_id: calEvt.id,
            calEvt_date: calEvt.start.dateTime,
            observer: {
                email: observer.data.email,
                avatar: observer.data.avatarUrl || observer.data.about.avatar
            },
            observed: {
                email: observed.data.email,
                avatar: observed.data.avatarUrl || observed.data.about.avatar
            },
            reflection: !first_feedback ? feedback : null,
            feedback: first_feedback ? first_feedback : null,
            tags: tags
        })
        ObservationsCollection.insert(obs, (err) => {
            if (err) {
                console.error(`observation for ${calEvt.start.dateTime} already created`)
                updateObservationsCollection({ reflection: feedback })
            } else {
                setFeedback("")
            }
        })
    }

    const updateObservationsCollection = update => {
        ObservationsCollection.update(observation._id, { $set: update }, (err) => {
            if (err) console.error(err)
            setFeedback("")
        })
    }

    const submitComments = () => {
        updateObservationsCollection({
            feedbacks: [...observation.feedbacks, { feedback, user }]
        })
    }

    const touchBarStyles = {
        position: 'fixed',
        left: '8px',
        top: '50%',
    }

    return (
        <article id="feedbacks-panel" className="pa2 pt4">
            <nav style={touchBarStyles} onClick={event => { event.stopPropagation(); props.setSelectedObs(null) }}><TouchBarV /></nav>
            <ObsAvatars observer={observer} observed={observed} />
            {observation && observation.reflection ? (
                <section>
                    <Feedback
                        HTMLcontent={observation.reflection}
                        email={observation.observed.email}
                        avatar={observation.observed.avatar} />
                </section>
            ) : null}
            {observation && observation.feedback ? (
                <section>
                    <Feedback
                        HTMLcontent={observation.feedback}
                        email={observation.observer.email}
                        avatar={observation.observer.avatar} />
                </section>
            ) : null}
            {isObserved && !observation ? (
                <section>
                    <Editor
                        name="reflection"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder="Add your reflection. How do you think it went? What where you trying to achieve or work on?" />
                    <section className="flex justify-end items-center">
                        <button
                            className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); submitObservation() }}>
                            Add Reflection
                        </button>
                    </section>
                </section>
            ) : null}
            {isObserved && observation && !observation.feedback ? (
                <section>
                    <p>Waiting for {observer.data.firstName} to leave you feedback</p>
                </section>
            ) : null}
            {isObserver && !observation ? (
                <section>
                    <Editor
                        name="first_feedback"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder={`${observed.data.firstName} has not left a reflection yet, but you can add your feedback now.`} />
                    <section className="flex justify-end items-center">
                        <CoachRubricTags onChange={setTags} />
                        <button
                            className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); submitObservation(feedback) }}> Feedback Now</button>
                    </section>
                </section>
            ) : null}
            {isObserver && observation && observation.reflection ? (
                <section>
                    <Editor
                        name="feedback"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder={`Respond to ${observed.data.firstName}'s reflection. Pick out aspects of the rubric that you observed.`} />
                    <section className="flex justify-end items-center">
                        <CoachRubricTags onChange={setTags} />
                        <button
                            className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); submitObservation(feedback) }}>Add Feedback</button>
                    </section>
                </section>
            ) : null}
            {isGuest && !observation ? (
                <section>
                    <p>Waiting for {observed.data.firstName} to leave a reflection and {observer.data.firstName} to leave some feedback. Come back later to see what went on in this session.</p>
                    <section className="flex justify-end items-center">
                        <button
                            className="flex-none bg-mv-supernova mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); props.setSelectedObs(null) }}>Back</button>
                    </section>
                </section>
            ) : null}
            {user && observation && observation.feedbacks.length ? (
                <section>
                    {observation.feedbacks.map(_feedback => {
                        const {
                            feedback,
                            user: {
                                _id,
                                services: {
                                    google: {
                                        email,
                                        picture
                                    }
                                }
                            }
                        } = _feedback
                        return <Feedback key={_id} HTMLcontent={feedback} email={email} avatar={picture} />
                    })}
                </section>
            ) : null}
            {observation && observation.reflection && observation.feedback ? (
                <section>
                    <Editor
                        name="comments"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder="Anything else to add?" />
                    <section className="flex justify-end items-center">
                        <button
                            className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); submitComments() }}>Comment</button>
                    </section>
                </section>
            ) : null}

        </article>
    )
}

export const FeedbacksPanel = withTracker(({ selectedObs }) => {
    const observationsSub = Meteor.subscribe('observations')
    const loading = !observationsSub.ready()
    const [ observation ] = ObservationsCollection.find({calEvt_id: selectedObs.calEvt.id}).fetch()
    return { loading, observation }
})(Feedbacks)