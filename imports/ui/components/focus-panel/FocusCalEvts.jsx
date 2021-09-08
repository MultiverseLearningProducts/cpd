import React from 'react'
import { FocusCalEvtsFeedbackForm } from './FocusCalEvtsFeedbackForm'
import { FocusCalEvtsReflectionForm } from './FocusCalEvtsReflectionForm'
import { format } from 'date-fns'

export const FocusCalEvts = props => {
    const {
        summary,
        start: {
            dateTime
        }
    } = props.data
    return (
        <section>
            <h3 className="mt0 mv-atlas">{summary} - {format(new Date(dateTime), 'EEE do MMM - h:mm aaa')}</h3>
            {props.data.mode == 0 ? <FocusCalEvtsFeedbackForm {...props} /> : null}
            {props.data.mode == 1 ? <FocusCalEvtsReflectionForm {...props} /> : null}
        </section>
    )
}