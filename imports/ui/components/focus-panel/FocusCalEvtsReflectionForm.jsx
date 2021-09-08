import React, { useState, useContext } from 'react'
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
        observation = {
            reflection: "",
            private_reflection: "",
            recording_url: "",
            obs_type: "2"
        }
    } = data

    
    const [feedback, setFeedback] = useState(observation.reflection)
    const [privateFeedback, setPrivateFeedback] = useState(observation.private_reflection)
    const [recordingURL, setRecordingURL] = useState(observation.recording_url)
    const [obsType, setObsType] = useState(observation.obs_type)
    const [formError, setFormError] = useState(null)
    const dispatch = useContext(DispatchContext)

    const submitObservation = () => {
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
            recording_url: recordingURL,
        }
        if (observation && observation._id) {
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
                recording_url: recordingURL,
            }
            ObservationsCollection.insert(insert)
        }
        dispatch({type: 'close_focus_panel'})
    }

    const checkRecordingUrl = event => {
        const { value } = event.currentTarget
        if (value.match(/zoom\.us\/rec\/share/) || value.match(/youtube\.com|youtu.be/)) return
        setRecordingURL('')
        setFormError('Must be a zoom or youtube link')
    }

    return (
        <section className="bg-mv-white-dwarf br3 pa3">
            <div className="flex">
                <div className="flex-auto pr3">
                    <label className="dib mv2 tl w-100">
                        Link to recording {formError 
                        ? <span className="red">⚠️{formError}!</span> 
                        : null}
                    </label>
                    <input 
                        name="recording-url" 
                        type="url"
                        pattern="zoom\.us\/rec\/share"
                        title="Must be a valid zoom link"
                        value={recordingURL} 
                        onChange={e => setRecordingURL(e.currentTarget.value)}
                        className='pa2 mv2 tl w-100 se-placeholder'
                        style={{border: 'solid 1px #dadada'}}
                        placeholder="optional link to recording"
                        onBlur={checkRecordingUrl}
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
                <button
                    className="flex-none bg-mv-molten mv-white shadow-4 ml2 pa2 br3 b--transparent"
                    onClick={event => { event.stopPropagation(); submitObservation() }}>
                    Add Reflection
                </button>
            </section>
        </section>
    )
}