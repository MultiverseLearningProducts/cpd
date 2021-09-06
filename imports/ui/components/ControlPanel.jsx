import React from 'react'
import { CalIcon, JournalIcon, TargetIcon } from './misc/Icons'

export const ControlPanel = ({selected, setPreviewPanel}) => {
    const glimmer = {
        isGlimmer: true,
        avatarUrl: '/watermark.jpg',
        displayName: '✦✦✦✦✦',
        about: {
            avatar: null
        },
        work: {
            title: '✦✦✦✦✦'
        }
    }
    const data = selected ? selected.data : glimmer
    const {
        isGlimmer = false,
        avatarUrl,
        displayName,
        about: {
            avatar
        },
        work: {
            title
        }
    } = data
    const loadPanelFor = heading => {
        setPreviewPanel({
            heading: heading,
            user: selected
        })
    }
    return (
        <section id="control-panel" style={{left: isGlimmer ? '-28rem' : '-2px'}}>
            <header>
                <div className="br-100 flex-none control-panel-avatar" style={{backgroundImage: `url('${avatarUrl || avatar}')`}}></div>
            </header>
            <main className="bg-mv-white-dwarf pa2 br3">
                <h2 className="ml3">{displayName}</h2>
                <h3 className="ml3">{title}</h3>
            </main>
            <footer>
                <nav>
                    <div onClick={() => loadPanelFor('Journal')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><JournalIcon /></div>
                    <div onClick={() => loadPanelFor('Stats')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><TargetIcon /></div>
                    <div onClick={() => loadPanelFor('Observations')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><CalIcon /></div>
                </nav>
            </footer>
        </section>
    )
}