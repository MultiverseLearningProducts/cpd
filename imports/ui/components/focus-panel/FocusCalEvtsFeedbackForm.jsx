import React, { useState, useEffect, useContext } from 'react'
import { DispatchContext } from './FocusPanel'
import { ObservationsCollection } from '../../../db/ObservationsCollection'
import { CoachRubricTags } from '../misc/CoachRubricTags'
import { Editor } from '../misc/Editor'
import { getFirstNameFromEmail } from '../../../both/getFirstNameFromEmail'

export const FocusCalEvtsFeedbackForm = props => {
    const {
        id,
        start: {
            dateTime
        },
        organizer,
        attendees,
        observation
    } = props.data

    const [feedback, setFeedback] = useState('')
    const [privateFeedback, setPrivateFeedback] = useState('')
    const [tags, setTags] = useState([])
    const dispatch = useContext(DispatchContext)
    
    useEffect(() => {
        const {
            feedback = '',
            private_feedback = '',
            tags = []
        } = props.data.observation || {}
        setFeedback(feedback)
        setPrivateFeedback(private_feedback)
        setTags(tags)
    }, [props.data.observation])

    const submitFeedback = () => {
        if (!feedback) return
        if (!props.data.observation) {
            const observed = props.profiles.find(profile => profile.data.email === organizer.email)
            const [_observer] = attendees.filter(att => att.email !== organizer.email)
            let observer = props.profiles.find(profile => profile.data.email === _observer.email)
            if (!observer) {
                observer = {
                    data: {
                        firstName:'unknown',
                        email:'noone@multiverse.io',
                        avatarUrl:`${window.location.origin}/watermark.jpg`
                    }
                }
            }
            const insert = {
                calEvt_id: id,
                calEvt_date: dateTime,
                observer: {
                    name: observer.data.firstName,
                    email: observer.data.email,
                    avatar: observer.data.avatarUrl || observer.data.about.avatar
                },
                observed: {
                    name: observed.data.firstName,
                    email: observed.data.email,
                    avatar: observed.data.avatarUrl || observed.data.about.avatar
                },
                obs_type: "2",
                reflection: '',
                private_reflection: '',
                feedback: feedback,
                private_feedback: privateFeedback,
                recording_url: '',
                tags: tags
            }
            ObservationsCollection.insert(insert)
        } else {
            const update = Object.assign(observation, {
                feedback: feedback,
                private_feedback: privateFeedback,
                tags: tags               
            })
            ObservationsCollection.update(observation._id, {$set: {...update}})
        }

        dispatch({type: 'close_focus_panel'})
    }

    return (
        <section>
            {observation && observation.reflection ? (
                <article className="bg-mv-white-dwarf br3 pa3 mb3">{observation.reflection}</article>
            ) : null}
            <form className="bg-mv-white-dwarf br3 pa3">
                <label className="dib mv2 tl w-100">Public feedback</label>
                <Editor
                    name="feedback"
                    defaultValue={feedback}
                    onChange={setFeedback}
                    placeholder={`Respond to ${getFirstNameFromEmail(organizer.email)}'s reflection. Pick out aspects of the rubric that you observed.`} />
                <div className="o-80">
                    <label className="dib mv2 tl w-100">Private feedback</label>
                    <Editor
                        name="private-feedback"
                        defaultValue={privateFeedback}
                        onChange={setPrivateFeedback}
                        placeholder="Your private feedback. Only you and your observer partner will ever see this." />
                </div>
                <section className="flex justify-end items-center mt3">
                    <CoachRubricTags onChange={setTags} value={tags} />
                    <button
                        type="button"
                        className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                        onClick={submitFeedback}>Add Feedback</button>
                </section>
            </form>
        </section>
    )
}