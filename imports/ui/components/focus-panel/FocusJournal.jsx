import React, { useRef, useContext } from 'react'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { getFirstNameFromEmail } from '../../../both/getFirstNameFromEmail'
import parse from 'html-react-parser'
import { Tag } from '../misc/Tag'
import { StateContext } from './FocusPanel'

export const VideoLink = ({recordingUrl}) => {
    if (!recordingUrl) return null
    let vendor = 'default';
    if (recordingUrl.match(/zoom.us/)) vendor = 'zoom'
    if (recordingUrl.match(/you/)) vendor = 'youtube'
    return <a className="link pointer" href={recordingUrl} target="_blank"><img src={`${vendor}.png`} alt="link to video content" className="video-link-logo" /></a>
}

export const FocusJournalEntry = ({ data }) => {
    const {
        calEvt_id,
        calEvt_date,
        observer,
        reflection,
        feedback,
        recording_url,
        tags
    } = data
    const ref = useRef(null)
    const state = useContext(StateContext)
    const date = format(new Date(calEvt_date), 'EEE do MMM yyyy', { locale: enGB })
    let scrolled = ''
    if (state.scrollTo && state.scrollTo === calEvt_id) {
        ref.current.scrollIntoView({behavior: "smooth", block: "center"})
        scrolled = 'scrolled-r'
    }

    return (
        <section ref={ref} id={calEvt_id} className={`relative flex flex-column mt3 ${scrolled}`}>
            <header className="flex-none h2 flex items-center justify-end">
                <div className="flex-auto"><hr className="hr-journal" /></div>
                <div className="mh2 flex-none">{date} <VideoLink recordingUrl={recording_url} /> feedback by {getFirstNameFromEmail(observer.email)}</div>
                <div className="flex-auto"><hr className="hr-journal" /></div>
            </header>
            <main className="flex-auto">
                <article className="mw7 lh-copy">
                    {parse(reflection)}
                </article>
                <article className="relative feedback i pl5 mw7 lh-copy">
                    <div style={{backgroundImage: `url(${observer.avatar})`}}></div>
                    {parse(feedback)}
                </article>
            </main>
            <footer className="flex-none h2 flex items-center pt3">
                {tags.length ? (
                    <p className="ma0 pa0 tags">
                        {tags.map(t => <Tag key={t.value} tag={t} />)}
                    </p>
                ) : <Tag tag={{ label: 'No tags' }} />}
            </footer>
        </section>
    )
}


export const FocusJournal = props => {
    return (
        <section id="focus-journal" className="bg-mv-white-dwarf bg-lined-paper pa3 paper overflow-scroll">
            {props.data.map(jrn => <FocusJournalEntry key={jrn._id} data={jrn} />)}
        </section>
    )
}