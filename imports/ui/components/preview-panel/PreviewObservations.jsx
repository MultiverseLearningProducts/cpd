import React, { useContext } from 'react'
import { DispatchContext } from '../focus-panel/FocusPanel'
import { isPast } from 'date-fns'

const googleColorCodes = [
    '#039be5',
    '#7986cb',
    '#33b679',
    '#8e24aa',
    '#e67c73',
    '#f6c026',
    '#f5511d',
    '#039be5',
    '#616161',
    '#3f51b5',
    '#0b8043',
    '#d60000'
]

const CalEvt = props => {
    const {
        summary,
        colorId = 0,
        mode,
        htmlLink
    } = props.calEvt
    const style = {
        backgroundColor: googleColorCodes[Number(colorId)]
    }

    if (mode > 1) {
        return <a style={style} className="dib link pa2 br3 mv1 mv-white" href={htmlLink} target="_blank">{summary}</a>
    } else {
        return <article onClick={() => props.openFocusWith(props.calEvt)} style={style} className="pa2 br3 mv1 mv-white pointer">{summary}</article>
    }
}

export const PreviewObservations = props => {
    const dispatch = useContext(DispatchContext)
    const { previewPanel, previewPanelCalEvents, observations } = props
    const browsingUser = Meteor.user()
    const {
        user: {
            data: {
                email
            }
        }
    } = previewPanel
    const calEvents = previewPanelCalEvents[email]
    if (previewPanelCalEvents.refresh) {
        return (
            <section id="preview-observations">
                <article className="bg-mv-white-dwarf br3 pa3 mb3 lh-copy">
                    Your Google token has expired. To gain access to your Google calendar once again you will have to log out and log back into this app. That will cause you to gain a fresh access token. Google issue these tokens with a life span of 1h for your security.
                </article>
            </section>
        )
    }

    const openFocusWith = (calEvt) => {
        if(email !== browsingUser.services.google.email) return
        dispatch({type: 'open_focus_panel', heading: 'Add Reflections and Feedback', content: calEvt})
    }
    
    if (!calEvents) return null
    const observing = calEvents
    .filter(calEvt => !isPast(new Date(calEvt.start.dateTime)) && calEvt.organizer.email !== email)
    .map(calEvt => ({...calEvt, mode: 3, observation: observations.find(ob => ob.calEvt_id === calEvt.id)}))
    
    const observedBy = calEvents
    .filter(calEvt => !isPast(new Date(calEvt.start.dateTime)) && calEvt.organizer.email === email)
    .map(calEvt => ({...calEvt, mode: 2, observation: observations.find(ob => ob.calEvt_id === calEvt.id)}))
    
    const toReflect = calEvents
    .filter(calEvt => isPast(new Date(calEvt.start.dateTime)) && calEvt.organizer.email === email)
    .map(calEvt => ({...calEvt, mode: 1, observation: observations.find(ob => ob.calEvt_id === calEvt.id)}))
    .filter(calEvt => !calEvt.observation || !calEvt.observation.reflection || !calEvt.observation.feedback)
    
    const toFeedback = calEvents
    .filter(calEvt => isPast(new Date(calEvt.start.dateTime)) && calEvt.organizer.email !== email)
    .map(calEvt => ({...calEvt, mode: 0, observation: observations.find(ob => ob.calEvt_id === calEvt.id)}))
    .filter(calEvt => !calEvt.observation || !calEvt.observation.reflection || !calEvt.observation.feedback)

    return (
        <section id="preview-observations">
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Sessions you are observing</h3>
                {observing.length ? (
                    observing.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt} />)
                ) : (
                    <p>Go see some coaching! Get invited to a session.</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Coaches observing you</h3>
                {observedBy.length ? (
                    observedBy.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt} />)
                ) : (
                    <p>Set up some observations. Invite someone to watch you coaching!</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Sessions you were observed</h3>
                {toReflect.length ? (
                    toReflect.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt} openFocusWith={openFocusWith} />)
                ) : (
                    <p>You don't have sessions that need a reflection</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2">
                <h3>Other coaches you observed</h3>
                {toFeedback.length ? (
                    toFeedback.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt} openFocusWith={openFocusWith} />)
                ) : (
                    <p>You don't have to give any feedback</p>
                )}
            </article>
        </section>
    )
}