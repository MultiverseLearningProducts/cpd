import React from 'react'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { getFirstNameFromEmail } from '../../../both/getFirstNameFromEmail'
import parse from 'html-react-parser'
import { Tag, TagCount } from '../misc/Tag'

const videoLink = recording_url => {
    if (!recording_url) return null
    return <a className="link pointer" href={recording_url} target="_blank">📺</a>
}

export const FocusJournal = ({data}) => {
    console.log(data)
    const {
        calEvt_date,
        observer,
        reflection,
        feedback,
        recording_url,
        tags
    } = data
    const date = format(new Date(calEvt_date), 'EEE do MMM yyyy', { locale: enGB})
    return (
        <section id="focus-journal" className="flex flex-column">
            <header className="flex-none h2 flex items-center">{date} feedback from {getFirstNameFromEmail(observer.email)} {videoLink(recording_url)}</header>
            <main className="flex-auto overflow-scroll">
                <article className="bg-mv-white-dwarf bg-lined-paper pa3 paper">
                    {parse(reflection)}
                    <hr/>
                    {parse(feedback || '? - waiting feedback')}
                </article>
            </main>
            <footer className="flex-none h2 flex items-center">
                {tags.length ? (
                    <p className="ma0 pa0 tags">
                        {tags.map(t => <Tag key={t.value} tag={t}/>)}
                    </p>
                ) : <Tag tag={{label: 'No tags'}} />}
            </footer>
        </section>
    )
}