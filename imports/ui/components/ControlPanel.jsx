import React from 'react'
import { propTypes } from 'react-addons-pure-render-mixin'
import { CalIcon, JournalIcon, TargetIcon } from './Icons'

export const ControlPanel = ({selected, setPreviewPanel}) => {
    const glimmer = {
        isGlimmer: true,
        avatarUrl: 'radial-gradient(hotpink, blue)',
        displayName: 'Not selected',
        about: {
            avatar: null
        },
        work: {
            title: 'Click on someone in the network'
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
                    <div onClick={() => setPreviewPanel('Journal')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><JournalIcon /></div>
                    <div onClick={() => setPreviewPanel('Stats')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><TargetIcon /></div>
                    <div onClick={() => setPreviewPanel('Observations')} className="relative bg-mv-white-dwarf pa1 br3 shadow-3 mv-hover-underline"><CalIcon /></div>
                </nav>
            </footer>
        </section>
    )
}