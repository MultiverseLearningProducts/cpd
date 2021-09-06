import React from 'react'
import { format, differenceInDays } from 'date-fns'
import parse from 'html-react-parser'
import { Tag } from './Tag'

const nameOf = ({email}) => email.split('.').shift().charAt(0).toUpperCase() + email.split('.').shift().substring(1)

const JournalEntry = props => {
    const {
        calEvt_date,
        observer,
        reflection,
        tags
    } = props.ob
    const daysAgo = differenceInDays(new Date(), new Date(calEvt_date))

    return (
        <article className="br3 bg-mv-white-dwarf mb3">
            <header className="flex">
                <h3 className="mv-atlas-mid ma0 flex-auto pa2 journal-extract">
                    {daysAgo} day{daysAgo === 1 ? '' : 's'} ago<br/>
                    <span className="mv-atlas">observation by {nameOf(observer)}</span>
                    {reflection ? parse(reflection) : '...'}
                    {tags.length ? (
                        <p className="ma0 pa0">{tags.map(t => <Tag tag={t}/>)}</p>
                    ) : null}
                </h3>
                <h4 className="ma0 flex-none pa2 date-card">
                    <span className="mv-atlas-mid tc dib w-100 f6" >
                        {format(new Date(calEvt_date), 'ccc')}
                    </span>
                    <span className="w-100 google-cal dib tc">
                        <span style={{transform: 'translate(0,4px)'}}>{format(new Date(calEvt_date), 'd')}</span>
                    </span>
                    <span className="mv-atlas tc dib w-100 mt1">
                        {format(new Date(calEvt_date), 'LLLL')}
                    </span>
                </h4>
            </header>
        </article>
    )
}

export const PreviewJournal = props => {
    const {
        previewPanel: {
            user
        },
        loading,
        observations
    } = props
    if (loading) return null
    console.log({
        user,
        observations
    })
    return (
        <section id="preview-journal" className="overflow-scroll">
           {observations.map(ob => <JournalEntry key={ob.calEvt_id} ob={ob}/>)}
        </section>
    )
}