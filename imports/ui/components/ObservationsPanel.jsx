import React from 'react'
import { Left2RightArrow, TouchBarV } from './DecorativeElements'
import parse from 'html-react-parser'

export const ObsFeedbacks = props => {
    const {
        calEvt_date,
        observer,
        observed,
        reflection,
        feedback,
        private_reflection,
        private_feedback,
        recordings_url,
        tags,
        feedbacks
    } = props.observation
    
    const getFirstName = email => {
        const name = email.split('.')[0]
        return name[0].toUpperCase() + name.substring(1)
    }
    
    if (!reflection && !feedback) return null
    
    return (
        <article className="lh-copy mw6">
            <i className="flex items-center mb3">
                {new Date(calEvt_date).toLocaleString('en-gb')}
                {recordings_url ? <a className="dib mh2" href={recordings_url} target="_blank">▶️</a> : null}
                <hr className="flex-auto ml2 b--black"/>
            </i>
            <span className="flex items-center flex-wrap justify-start">{tags.map(t => <span key={t.value} className="tag">{t.label}</span>)}</span>
            {reflection ? parse(reflection) : <p className="o-50 pa2 b--dashed bw1 b--black-50">Waiting for {getFirstName(observed.email)}'s reflection.</p>}
            {private_reflection ? <span className="o-80">{parse(private_reflection)}</span> : null}
            {feedback ? <i className="mt2">---{observer.email}--- {parse(feedback)}</i> : <p className="o-50 pa2 b--dashed bw1 b--black-50">Waiting for feedback from {getFirstName(observer.email)}</p>}
            {private_feedback ? <i className="o-80">{parse(private_feedback)}</i> : null}
            {feedbacks.length ? <label className="db b i">Comments</label> : null}
            {feedbacks.map(fb => (
                <article key={fb.user._id}>
                    <article className="flex justify-start items-center">
                        <div className="br-100 flex-none feedback-panel-avatar" style={{ backgroundImage: `url('${fb.user.services.google.picture}')` }}></div>
                        <small className="dib mh2 tr"><a href={`mailto:${fb.user.services.google.email}`}>{fb.user.profile.name}</a></small>
                        {parse(fb.feedback)}
                    </article>
                </article>
            ))}
        </article>
    )
}

export const ObsAvatars = props => {
    const { observer, observed } = props
    return (
        <article className="flex items-center justify-center">
            <span className="dib" className="ba bw3 b--mv-ultraviolet br-100 info-panel-avatar" style={{ backgroundImage: `url('${observer.data.avatarUrl || observer.data.about.avatar}')` }}>
                <img className="dn" alt={observer.data.firstName} />
            </span>
            <span className="dib" style={{transform: `scale(1,1)`}}><Left2RightArrow /></span>
            <span className="dib" className="ba bw3 b--mv-aurora br-100 info-panel-avatar" style={{ backgroundImage: `url('${observed.data.avatarUrl || observed.data.about.avatar}')` }}>
                <img className="dn" alt={observed.data.firstName} />
            </span>
        </article>
    )
}

export const ObsCard = props => {
    const {
        calEvt: {
            id,
            summary,
            status,
            start: {
                dateTime
            },
            htmlLink,
            attendees = [],
            organizer
        },
        profiles,
        onSelected
    } = props
    const isPast = new Date(dateTime).getTime() <= new Date().getTime()
    const findProfile = _email => profiles.nodes.find(p => p.data.email === _email)
    const [attendeeObserver] = attendees.filter(att => !att.organizer)
    if (!attendeeObserver) return (
        <article className="ba b--light-silver br2 pa2 mb2 bg-mv-white-dwarf relative">
            Can't find attendee observer. Check <a href={htmlLink} target="_Blank">{summary}</a>.
        </article>
    )
    const observer = findProfile(attendeeObserver.email)
    const observed = findProfile(organizer.email)
    if (!observer || !observed) return null
    const touchBarStyles = {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translate(0,-50%)'
    }
    return (
        <article className="ba b--light-silver br2 pa2 mb2 bg-mv-white-dwarf relative">
            <ObsAvatars observer={observer} observed={observed} />
            <div className="mt2">
                <span>{observer && observer.data && observer.data.firstName} observing {observed && observed.data && observed.data.firstName}&nbsp;on&nbsp;</span>
                <time className="dib" dateTime={new Date(dateTime)}>{new Date(dateTime).toDateString()}&nbsp;at&nbsp;{new Date(dateTime).toLocaleTimeString().substring(0, 5)}</time>
                <a className="link ml1" href={htmlLink} target="_Blank">📆</a>
            </div>
            {isPast ? (
                <nav onClick={event => {event.stopPropagation(); onSelected({observer, observed, calEvt: props.calEvt})}} style={touchBarStyles}>
                    <TouchBarV />
                </nav>
            ) : null}
        </article>
    )
}

export const ObservationsPanel = props => {
    const { profiles, calEvents } = props
    
    const futureEvents = calEvents.filter(calEvt => {
        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false
        return new Date(calEvt.start.dateTime).getTime() > new Date().getTime()
    })
    const pastEvents = calEvents.filter(calEvt => {
        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false
        return new Date(calEvt.start.dateTime).getTime() <= new Date().getTime()
    })

    return (
        <aside className="pa2 ml-auto mr-auto">
            <h3 className="underline">Observations Booked</h3>
            {futureEvents.length ? (
                <section>
                    {futureEvents.map(calEvt => <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} onSelected={props.onSelected} />)}
                </section>
            ) : (
                <p className="tl lh-copy measure">
                    You have no observations booked yet. Why not reach out now and book an observation. Tag your Google calendar event with <span className="dib b">[obs]</span> and it will show up here.
                </p>
            )}
            <h3 className="underline">Previous Observations</h3>
            {pastEvents.length ? (
                <section>
                    {pastEvents.map(calEvt => <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} onSelected={props.onSelected} />)}
                </section>
            ) : (
                <p className="tl lh-copy measure">
                    You have no observations completed yet. When you do they will appear here. Then you will be promoted to leave a reflection, and for your observer to leave their feedback.
                </p>
            )}
        </aside>
    )
}