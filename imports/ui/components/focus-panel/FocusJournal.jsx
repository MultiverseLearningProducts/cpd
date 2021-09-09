import React, { useRef, useContext } from 'react'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { getFirstNameFromEmail } from '../../../both/getFirstNameFromEmail'
import parse from 'html-react-parser'
import { Tag } from '../misc/Tag'
import { StateContext } from './FocusPanel'

const videoLink = recording_url => {
    if (!recording_url) return null
    return <a className="link pointer" href={recording_url} target="_blank">📺</a>
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
                <div className="flex-auto"><hr style={{border: '1px dashed var(--mv-deep-space)'}}/></div>
                <div className="ml3">{date} feedback from {getFirstNameFromEmail(observer.email)}&nbsp;{videoLink(recording_url)}</div>
            </header>
            <main className="flex-auto">
                <article>
                    {parse(reflection)}
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