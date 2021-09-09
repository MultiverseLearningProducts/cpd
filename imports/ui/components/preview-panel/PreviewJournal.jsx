import React, { useContext } from 'react'
import { format, differenceInDays } from 'date-fns'
import parse from 'html-react-parser'
import { Tag, TagCount } from '../misc/Tag'
import { DispatchContext, StateContext } from '../focus-panel/FocusPanel'

const JournalEntry = props => {
    const {
        calEvt_id,
        calEvt_date,
        observer,
        reflection,
        tags = []
    } = props.ob
    
    const daysAgo = differenceInDays(new Date(), new Date(calEvt_date))
    
    const state = useContext(StateContext)
    const scrolled = state.scrollTo && state.scrollTo === calEvt_id ? 'scrolled-l' : ''

    return (
        <article className={`relative br3 bg-mv-white-dwarf mb3 ${scrolled}`} onClick={() => props.scrollTo(calEvt_id)}>
            <header className="flex">
                <h3 className="mv-atlas-mid ma0 flex-auto pa2 journal-extract">
                    {daysAgo} day{daysAgo === 1 ? '' : 's'} ago<br/>
                    <span className="mv-atlas">observation by {observer.name}</span>
                    {reflection ? parse(reflection.substring(0,47) + '</p>') : <p>...</p>}
                    {tags.length ? (
                        <p className="ma0 pa0 tags">
                            <TagCount tag={{label: tags.length}} />
                            {tags.map(t => <Tag key={t.value} tag={t}/>)}
                        </p>
                    ) : null}
                </h3>
                <h4 className="ma0 flex-none pa2 date-card">
                    <span className="mv-atlas-mid tc dib w-100 f6" >
                        {format(new Date(calEvt_date), 'ccc')}
                    </span>
                    <span className="google-cal tc">
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
        loading,
        observations,
        previewPanel
    } = props

    if (!previewPanel) return

    const journals = observations.filter(ob => {
        return previewPanel.user.data.email === ob.observed.email && ob.reflection && ob.feedback
    })

    const dispatch = useContext(DispatchContext)
    
    const scrollTo = calEvt_id => {
        dispatch({
            type: 'scroll_to',
            content: journals,
            scrollTo: calEvt_id
        })
    }

    return (
        <section id="preview-journal" className="overflow-scroll">
           {!loading && journals.length 
           ? (journals.map(ob => <JournalEntry key={ob.calEvt_id} ob={ob} scrollTo={scrollTo} />)) 
           : <article className="br3 bg-mv-white-dwarf mb3 pa3 lh-copy">Your reflective journal and the conversations you have with other coaches about your practice will be available here.</article>}
        </section>
    )
}