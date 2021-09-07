import React, { useContext } from 'react'
import { FocusStats } from './FocusStats'
import { FocusJournal } from './FocusJournal'
import { FocusCalEvts } from './FocusCalEvts'
import './focus.css'

export const focusPanelState = {open: false, heading: '✦✦✦✦✦', content: null}

export const focusPanelReducer = (state, action) => {
    switch(action.type) {
        case 'open_focus_panel':
            return {open: true, heading: action.heading, content: action.content};
        case 'close_focus_panel':
            return {open: false, heading: '✦✦✦✦✦', content: null};
        default:
            return state
    }
}

export const StateContext = React.createContext(focusPanelState)
export const DispatchContext = React.createContext()

export const Panel = () => {
    const { open, heading, content } = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    return (
        <section id="focus-panel" style={{right: open ? '-3px' : `-${window.innerWidth - 448}px`}}>
            <header className="flex items-center">
                <h1 className="flex-auto mv0">{heading}</h1>
                <button 
                    type="button" 
                    className="bg-transparent b--transparent mv-deep-space" 
                    onClick={() => dispatch({type: 'close_focus_panel'})}>close</button>
            </header>
            <main>
                {heading === 'Your Strengths' ? <FocusStats data={content} /> : null}
                {heading === 'Reflections and Insights Journal' ? <FocusJournal data={content} /> : null}
                {heading === 'Add Reflections and Feedback' ? <FocusCalEvts data={content} /> : null}
            </main>
        </section>
    )
}
