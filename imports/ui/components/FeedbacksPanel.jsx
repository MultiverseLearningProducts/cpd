import React, { useState, useEffect } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import parse from 'html-react-parser'
import { ObsAvatars, ObsFeedbacks } from './ObservationsPanel'
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
            recording_url: "",
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

const Feedbacks = props => {
    if (!props.selectedObs) return null
    const [feedback, setFeedback] = useState("")
    const [privateFeedback, setPrivateFeedback] = useState("")
    const [recordingURL, setRecordingURL] = useState("")
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

    const submitObservation = () => {
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
            reflection: feedback,
            private_reflection: privateFeedback,
            recording_url: recordingURL,
        })
        ObservationsCollection.insert(obs, (err) => {
            if (err) {
                console.error(`observation for ${calEvt.start.dateTime} already created`)
            } else {
                setFeedback("")
                setPrivateFeedback("")
            }
        })
    }

    const submitFeedback = () => {
        updateObservationsCollection({
            feedback: feedback,
            private_feedback: privateFeedback,
            tags: tags
        })
    }
    
    const submitComments = () => {
        updateObservationsCollection({
            feedbacks: [...observation.feedbacks, { feedback, user }]
        })
    }

    const updateObservationsCollection = update => {
        ObservationsCollection.update(observation._id, { $set: update }, (err) => {
            if (err) console.error(err)
            setFeedback("")
            setPrivateFeedback("")
            setTags([])
        })
    }

    const touchBarStyles = {
        position: 'fixed',
        left: '8px',
        top: '50%',
        zIndex: '10'
    }

    return (
        <article id="feedbacks-panel" className="pa2 pt4">
            <nav style={touchBarStyles} onClick={event => { event.stopPropagation(); props.setSelectedObs(null) }}><TouchBarV /></nav>
            <ObsAvatars observer={observer} observed={observed} />
            {observation && (observation.reflection || observation.feedback) ? (
                <section className="bg-mv-white-dwarf bg-lined-paper pa4 tl">
                    <ObsFeedbacks observation={observation} />
                </section>
            ) : null}
            {isObserved && !observation ? (
                <section>
                    <label className="dib mv2 tl w-100">Link to recording</label>
                    <input 
                        name="recording-url" 
                        type="url" 
                        defaultValue={recordingURL} 
                        onChange={e => setRecordingURL(e.currentTarget.value)}
                        className='pa2 mv2 tl w-100 se-placeholder'
                        style={{border: 'solid 1px #dadada'}}
                        placeholder="optional link to recording" />
                    <label className="dib mv2 tl w-100">Public reflection</label>
                    <Editor
                        name="reflection"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder="Add your reflection. How do you think it went? What where you trying to achieve or work on?" />
                    <div className="o-80">
                        <label className="dib mv2 tl w-100">Private reflection</label>
                        <Editor
                            name="private-reflection"
                            defaultValue={privateFeedback}
                            onChange={setPrivateFeedback}
                            placeholder="Your private reflection. Only you and your observer partner will ever see this" />
                    </div>
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
                    <p>Waiting for {observer.data.firstName} to leave you feedback.</p>
                </section>
            ) : null}
            {isObserver && (!observation || !observation.reflection) ? (
                <section>
                    <p>Waiting for {observed.data.firstName} to write their reflection.</p>
                </section>
            ) : null}
            {isObserver && observation && observation.reflection && (!observation.feedback || !observation.private_feedback) ? (
                <section>
                    <label className="dib mv2 tl w-100">Public feedback</label>
                    <Editor
                        name="feedback"
                        defaultValue={feedback}
                        onChange={setFeedback}
                        placeholder={`Respond to ${observed.data.firstName}'s reflection. Pick out aspects of the rubric that you observed.`} />
                    <div className="o-80">
                        <label className="dib mv2 tl w-100">Private feedback</label>
                        <Editor
                            name="private-feedback"
                            defaultValue={privateFeedback}
                            onChange={setPrivateFeedback}
                            placeholder="Your private feedback. Only you and your observer partner will ever see this." />
                    </div>
                    <section className="flex justify-end items-center">
                        <CoachRubricTags onChange={setTags} />
                        <button
                            className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                            onClick={event => { event.stopPropagation(); submitFeedback() }}>Add Feedback</button>
                    </section>
                </section>
            ) : null}
            {isGuest && !observation ? (
                <section>
                    <p>Waiting for {observed.data.firstName} to leave a reflection and {observer.data.firstName} to leave some feedback. Come back later to see what went on in this session.</p>
                    <section className="flex justify-end items-center">
                        <button
                            className="flex-none bg-mv-supernova shadow-4 ml2 pa2 br3 b--transparent"
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