import React, { useState, useContext, useEffect } from 'react'
import { Editor } from '../misc/Editor'
import { ObservationsCollection } from '../../../db/ObservationsCollection'
import { DispatchContext } from './FocusPanel'

export const FocusCalEvtsReflectionForm = ({data, profiles}) => {
    const {
        id,
        start: {
            dateTime
        },
        organizer,
        attendees,
        observation
    } = data

    const {
        reflection = '',
        private_reflection = '',
        recording_url = '',
        obs_type = '2' 
    } = observation || {}
    
    const [feedback, setFeedback] = useState(reflection)
    const [privateFeedback, setPrivateFeedback] = useState(private_reflection)
    const [recordingURL, setRecordingURL] = useState(recording_url)
    const [obsType, setObsType] = useState(obs_type)
    const [formError, setFormError] = useState(null)
    const dispatch = useContext(DispatchContext)

    useEffect(() => {
        const {
            reflection = '',
            private_reflection = '',
            recording_url = '',
            obs_type = '2' 
        } = data.observation || {}
        setObsType(obs_type)
        setRecordingURL(recording_url)
        setFeedback(reflection)
        setPrivateFeedback(private_reflection)
    }, [data])

    const submitObservation = () => {
        if (!feedback) return
        const observed = profiles.find(profile => profile.data.email === organizer.email)
        const [_observer] = attendees.filter(att => att.email !== organizer.email)
        let observer = profiles.find(profile => profile.data.email === _observer.email)
        if (!observer) {
            observer = {
                data: {
                    firstName:'unknown',
                    email:'noone@multiverse.io',
                    avatarUrl:`${window.location.origin}/watermark.jpg`
                }
            }
        }
        if (observation && observation._id) {
            // if the observation has already been created
            const update = Object.assign(observation, {
                obs_type: obsType,
                reflection: feedback,
                private_reflection: privateFeedback,
                recording_url: recordingURL,                
            })
            ObservationsCollection.update(observation._id, {$set: {...update}})
        } else {
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
                obs_type: obsType,
                reflection: feedback,
                private_reflection: privateFeedback,
                feedback: '',
                private_feedback: '',
                recording_url: recordingURL,
                tags: []
            }
            ObservationsCollection.insert(insert)
        }
        dispatch({type: 'close_focus_panel'})
    }

    const checkRecordingUrl = event => {
        const url = event.currentTarget.value
        if (url.match(/zoom\.us\/rec\/share/)) {
            const [zoomUrl = ""] = url.match(/https\S+/)
            const [zoomPasscode = ""] = url.match(/\S+$/)
            setRecordingURL(zoomUrl)
            if (zoomPasscode !== zoomUrl) setFeedback(`[zoom passcode: ${zoomPasscode}] ${feedback}`)
        } else if (url.match(/youtube\.com|youtu.be/)) {
            setRecordingURL(url)
        } else {
            setRecordingURL('')
            setFormError('Must be a valid zoom recording link or a youtube link')
        }
    }

    return (
        <section className="bg-mv-white-dwarf br3 pa3">
            <div className="flex">
                <div className="flex-auto pr3">
                    <label className="dib mv2 tl w-100">
                        Link to recording {formError 
                        ? <span className="red">⚠️ {formError}!</span> 
                        : null}
                    </label>
                    <input 
                        name="recording-url" 
                        type="url"
                        pattern="zoom\.us\/rec\/share"
                        title="Must be a valid zoom link"
                        value={recordingURL} 
                        onChange={() => {}}
                        className='pa2 mv2 tl w-100 se-placeholder'
                        style={{border: 'solid 1px #dadada', fontSize: '13px'}}
                        placeholder="Paste recording info"
                        onInput={checkRecordingUrl}
                        onFocus={() => setFormError(null)} />
                </div>
                <div className="flex-none">
                    <label className="dib mv2 tl w-100">Type of observation</label>
                    <select name="obsType" className="select-css mv2" value={obsType} onChange={e => setObsType(e.currentTarget.value)}>
                        <option value="1">1:1 Coaching</option>
                        <option value="2">Delivery</option>
                        <option value="3">Group Coaching</option>
                        <option value="4">Progress Review</option>
                    </select>
                </div>
            </div>
            <label className="dib mv2 tl w-100">Public reflection</label>
            <Editor
                name="reflection"
                defaultValue={feedback}
                onChange={setFeedback}
                placeholder="Add your reflection. What went well? Even better if?" />
            <div className="o-80">
                <label className="dib mv2 tl w-100">Private reflection</label>
                <Editor
                    name="private-reflection"
                    defaultValue={privateFeedback}
                    onChange={setPrivateFeedback}
                    placeholder="Your private reflection. Only you and your observer partner will ever see this" />
            </div>
            <section className="mt3 flex justify-end items-center">
                {feedback && feedback !== '<p><br></p>' ? (
                    <button
                        className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                        onClick={event => { event.stopPropagation(); submitObservation() }}>
                        Add Reflection
                    </button>
                ) : null}

            </section>
        </section>
    )
}