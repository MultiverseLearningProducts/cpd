import React from 'react'
import { ObsAvatars } from './ObservationsPanel'
import { TouchBarV } from './DecorativeElements'

export const FeedbacksPanel = props => {
    if (!props.selectedObs) return null
    const {
        observer,
        observed
    } = props.selectedObs
    const touchBarStyles = {
        position: 'fixed',
        left: '8px',
        top: '50%',
    }
    return (
        <article className="pa2 pt4">
            <nav style={touchBarStyles} onClick={event => {event.stopPropagation();props.setSelectedObs(null)}}><TouchBarV  /></nav>
            <ObsAvatars observer={observer} observed={observed} />
            <h2>Feedbacks for {observed.data.displayName}</h2>
            <textarea className="w-75 pa2" rows="9" placeholder="Pick out elements of the Rubric that you observed. Add any other feedback you think will help your fellow coach to be even more awesome!"></textarea><br/>
            <button onClick={event => event.stopPropagation()}>Add Feedback</button>
        </article>        
    )
}