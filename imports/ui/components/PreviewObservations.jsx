import React from 'react'

const inFuture = date => {
    new Date(date).getTime() < new Date().getTime()
}

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
        id,
        summary,
        colorId = 0
    } = props.calEvt
    const style = {
        backgroundColor: googleColorCodes[Number(colorId)]
    }
    const openFocusWith = () => {
        console.log(props.calEvt)
    }
    return (
        <article onClick={openFocusWith} style={style} className="pa2 br3 mv1 mv-white pointer">{summary}</article>
    )
}

export const PreviewObservations = props => {
    const { previewPanel, previewPanelCalEvents } = props
    const {
        user: {
            data: {
                email
            }
        }
    } = previewPanel
    const calEvents = previewPanelCalEvents[email]
    if (!calEvents) return null
    const observing = calEvents.filter(calEvt => {
        if (!inFuture(calEvt.start.dateTime)) return false
        return calEvt.attendees.find(att => att.email === email && !att.organizer)    
    })
    const observedBy = calEvents.filter(calEvt => {
        if (!inFuture(calEvt.start.dateTime)) return false
        return calEvt.attendees.find(att => att.email === email && att.organizer)
    })
    const toRefelect = calEvents.filter(calEvt => {
        if (inFuture(calEvt.start.dateTime)) return false
        return calEvt.attendees.find(att => att.email === email && att.organizer)
    })
    const toFeedback = calEvents.filter(calEvt => {
        if (inFuture(calEvt.start.dateTime)) return false
        return calEvt.attendees.find(att => att.email === email && !att.organizer)
    }) 
    return (
        <section id="preview-observations">
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Sessions you are observing</h3>
                {observing.length ? (
                    observing.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt}/>)
                ) : (
                    <p>Set up some observations. Go see some coaching!</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Coaches observing you</h3>
                {observedBy.length ? (
                    observedBy.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt}/>)
                ) : (
                    <p>Set up some observations. Get someone to watch you coaching!</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2 mb3">
                <h3>Sessions to reflect on</h3>
                {toRefelect.length ? (
                    toRefelect.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt}/>)
                ) : (
                    <p>You don't have sessions that need a reflection</p>
                )}
            </article>
            <article className="bg-mv-white-dwarf br3 ph3 pv2">
                <h3>Feedback on these sessions</h3>
                {toFeedback.length ? (
                    toFeedback.map(calEvt => <CalEvt key={calEvt.id} calEvt={calEvt}/>)
                ) : (
                    <p>You don't have to give any feedback.</p>
                )}
            </article>
        </section>
    )
}