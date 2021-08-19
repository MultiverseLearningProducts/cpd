import React from 'react'
import { Left2RightArrow, HexBut } from './DecorativeElements'
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
    
    const showPrivate = () => {
        const {services: {google: { email }}} = Meteor.user()
        return email === observer.email
        || email === observed.email
    }

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
            <span className="flex items-center flex-wrap justify-start">{tags.length ? tags.map(t => <span key={t.value} className="tag">{t.label}</span>) : "Not tagged"}</span>
            {reflection ? parse(reflection) : <p className="o-50 pa2 b--dashed bw1 b--black-50">Waiting for {getFirstName(observed.email)}'s reflection.</p>}
            {showPrivate() && private_reflection ? <span className="o-80">{parse(private_reflection)}</span> : null}
            {/* {feedback ? <i className="mt2 mv-ultraviolet">----{observer.email}---- {parse(feedback)}</i> : <p className="o-50 pa2 b--dashed bw1 b--black-50">Waiting for feedback from {getFirstName(observer.email)}</p>} */}
            {showPrivate() && private_feedback ? <i className="o-80 mv-ultraviolet">{parse(private_feedback)}</i> : null}
            {feedback ? <i className="mt2 mv-ultraviolet">----{observer.email}----</i> : null}
            {feedbacks.length ? <label className="db b i mt2">Comments</label> : null}
            {feedbacks.map(fb => (
                <article key={fb.user._id}>
                    <article className="flex justify-start items-center">
                        <div className="br-100 flex-none feedback-panel-avatar" style={{ backgroundImage: `url('${fb.user.services.google.picture}')` }}></div>
                        <small className="dib mh2 tr"><a className="mv-ultraviolet" href={`mailto:${fb.user.services.google.email}`}>{fb.user.profile.name}</a></small>
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
            organizer,
            observation
        },
        profiles,
        onSelected
    } = props

    if (observation && observation.reflection && observation.feedback) return null
    
    const isPast = new Date(dateTime).getTime() <= new Date().getTime()
    const findProfile = _email => profiles.nodes.find(p => p.data.email === _email)
    const [attendeeObserver] = attendees.filter(att => !att.organizer)
    if (!attendeeObserver) return (
        <article className="ba b--light-silver br2 pa2 mb2 bg-mv-white-dwarf relative tl">
            Can't find attendee observer. Check <a href={htmlLink} target="_Blank">{summary}</a>.
        </article>
    )
    
    const observer = findProfile(attendeeObserver.email)
    const observed = findProfile(organizer.email)

    if (!observer || !observed) return null

    return (
        <article className="ba b--light-silver br2 pa2 mb2 mr3 bg-mv-white-dwarf relative">
            <div className="mv2 tl">
                <span>{observer && observer.data && observer.data.firstName} <Left2RightArrow width="28" height="16" /> {observed && observed.data && observed.data.firstName}&nbsp;on&nbsp;</span>
                <time className="dib" dateTime={new Date(dateTime)}>{new Date(dateTime).toDateString()}&nbsp;at&nbsp;{new Date(dateTime).toLocaleTimeString().substring(0, 5)}</time>
                <a className="link ml1 dib" href={htmlLink} target="_Blank">📆</a>
                {isPast ? (
                    <nav className='dib absolute right-0' style={{top: '50%', transform: 'translate(19px,-16px)'}} onClick={event => {event.stopPropagation(); onSelected({observer, observed, calEvt: props.calEvt})}}>
                        <HexBut dir='right' width='37' height='32' />
                    </nav>
                ) : null}
            </div>
        </article>
    )
}

export const ObservationsPanel = props => {
    const { profiles, calEvents, observations } = props
    
    const futureEvents = calEvents.filter(calEvt => {
        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false
        return new Date(calEvt.start.dateTime).getTime() > new Date().getTime()
    })
    const pastEvents = calEvents.filter(calEvt => {
        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false 
        calEvt.observation = observations.find(obs => obs.calEvt_id === calEvt.id)
        return new Date(calEvt.start.dateTime).getTime() <= new Date().getTime()
    })

    return (
        <aside className="pr2 br2">
            {futureEvents.length ? (
                <section className="bg-mv-white-dwarf pa2 br2">
                    {futureEvents.map(calEvt => <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} onSelected={props.onSelected} />)}
                </section>
            ) : (
                <p className="mt0 bg-mv-white-dwarf tl lh-copy br2 pa4">
                    You have no observations booked. Why not reach out now and invite another coach to come watch you. Tag your Google calendar event with <span className="dib b">(obs)</span> and it will show up here.
                </p>
            )}
            {pastEvents.length ? (
                <section className="bg-mv-white-dwarf pa2 br2">
                    {pastEvents.map(calEvt => <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} onSelected={props.onSelected} />)}
                </section>
            ) : (
                <p className="mt0 bg-mv-white-dwarf tl lh-copy br2 pa4">
                    You have no observations completed yet. When you do they will appear here. Then you will be promoted to leave a reflection, and for your observer to leave their feedback.
                </p>
            )}
        </aside>
    )
}