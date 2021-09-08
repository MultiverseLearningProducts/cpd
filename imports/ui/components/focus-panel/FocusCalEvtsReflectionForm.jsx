import React, { useState, useContext } from 'react'
import { Editor } from '../misc/Editor'
import { ObservationsCollection } from '../../../db/ObservationsCollection'
import { DispatchContext } from './FocusPanel'

export const FocusCalEvtsReflectionForm = ({data, profiles}) => {
    const [feedback, setFeedback] = useState("")
    const [privateFeedback, setPrivateFeedback] = useState("")
    const [recordingURL, setRecordingURL] = useState("")
    const [obsType, setObsType] = useState("2")
    const dispatch = useContext(DispatchContext)

    const {
        id,
        start: {
            dateTime
        },
        organizer,
        attendees,
        summary,
        observation
    } = data

    console.log(data)
    
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
        console.log(insert)
        dispatch({type: 'close_focus_panel'})
    }

    return (
        <section className="bg-mv-white-dwarf br3 pa3">
            <div className="flex">
                <div className="flex-auto pr3">
                    <label className="dib mv2 tl w-100">Link to recording</label>
                    <input 
                        name="recording-url" 
                        type="url" 
                        defaultValue={recordingURL} 
                        onChange={e => setRecordingURL(e.currentTarget.value)}
                        className='pa2 mv2 tl w-100 se-placeholder'
                        style={{border: 'solid 1px #dadada'}}
                        placeholder="optional link to recording" />
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