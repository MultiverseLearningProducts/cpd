import React from 'react'
import { Left2RightArrow } from './Left2RightArrow'

const ObsAvatars = props => {
    const { observer, observed } = props
    const user = Meteor.user()
    const isObserving = user.services.google.email === observer.data.email
    return isObserving
    ? (
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
    : (
        <article className="flex items-center justify-center">
            <span className="dib" className="ba bw3 b--mv-aurora br-100 info-panel-avatar" style={{ backgroundImage: `url('${observed.data.avatarUrl || observed.data.about.avatar}')` }}>
                <img className="dn" alt={observed.data.firstName} />
            </span>
            <span className="dib" style={{transform: `scale(-1,1)`}}><Left2RightArrow /></span>
            <span className="dib" className="ba bw3 b--mv-ultraviolet br-100 info-panel-avatar" style={{ backgroundImage: `url('${observer.data.avatarUrl || observer.data.about.avatar}')` }}>
                <img className="dn" alt={observer.data.firstName} />
            </span>
        </article>
    )
}

const ObsCard = props => {
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
        profiles
    } = props
    const isPast = new Date(dateTime).getTime() <= new Date().getTime()
    const findProfile = _email => props.profiles.nodes.find(p => p.data.email === _email)
    const [attendeeObserver] = attendees.filter(att => !att.organizer)
    if (!attendeeObserver) return null
    const observer = findProfile(attendeeObserver.email)
    const observed = findProfile(organizer.email)
    if (!observer || !observed) return null
    return (
        <article className="ba b--light-silver br2 pa2 mb2 bg-mv-white-dwarf">
            <ObsAvatars observer={observer} observed={observed} />
            <div className="mt2">
                <span>{observer && observer.data && observer.data.firstName} observing {observed && observed.data && observed.data.firstName}&nbsp;on&nbsp;</span>
                <time className="dib" dateTime={new Date(dateTime)}>{new Date(dateTime).toDateString()}&nbsp;at&nbsp;{new Date(dateTime).toLocaleTimeString().substring(0, 5)}</time>
                <a className="link ml1" href={htmlLink} target="_Blank">📆</a>
                {isPast ? (
                    <nav className="pv2 flex justify-around">
                        <button type="button">Needs Reflection</button>
                        <button type="button">Needs Feedback</button>
                    </nav>
                ) : null}
            </div>
        </article>
    )
}

export const ObservationsPanel = props => {
    const { profiles, calEvents } = props

    return (
        <aside className="pa2 ml-auto mr-auto">
            <h3 className="underline">Observations Booked</h3>
            {calEvents.length ? (
                <section>
                    {calEvents.filter(calEvt => {
                        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false
                        return new Date(calEvt.start.dateTime).getTime() > new Date().getTime()
                    }).map(calEvt => {
                        return (
                            <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} />
                        )
                    })
                    }
                </section>
            ) : (
                <p className="tl lh-copy measure">
                    You have no observations booked yet. Why not reach out now and book an observation. Tag your Google calendar event with <span className="dib b">[obs]</span> and it will show up here.
                </p>
            )}
            <h3 className="underline">Previous Observations</h3>
            {calEvents.length ? (
                <section>
                    {calEvents.filter(calEvt => {
                        if (calEvt.recurringEventId || calEvt.status === 'cancelled') return false
                        return new Date(calEvt.start.dateTime).getTime() <= new Date().getTime()
                    }).map(calEvt => {
                        return (
                            <ObsCard key={calEvt.id} calEvt={calEvt} profiles={profiles} />
                        )
                    })
                    }
                </section>
            ) : (
                <p className="tl lh-copy measure">
                    You have no observations completed yet. When you do they will appear here. Then you will be promoted to leave a reflection, and for your observer to leave their feedback.
                </p>
            )}
        </aside>
    )
}