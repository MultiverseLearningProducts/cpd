import React from 'react'

export const NetworkInfoPanel = props => {
    const {
        selected: {
            data: {
                id,
                displayName,
                firstName,
                avatarUrl,
                email,
                work: {
                    title,
                    directReports,
                    durationOfEmployment: {
                        humanize
                    }
                },
                about: {
                    avatar
                }
            }
        }
    } = props

    return (
        <article onClick={props.toggleNetworkInfoPanel} className="tc bg-mv-supernova">
            <svg width="127px" height="7px" viewBox="0 0 127 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <title>Rectangle</title>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle" fill="#D9C249" x="0" y="0" width="127" height="7" rx="3.5"></rect>
                </g>
            </svg>
            <header className="w-100 flex items-center tl">
                <div className="flex-auto pa2 pr5">
                    <h2 className="mb0">{displayName}</h2>
                    <h3 className="mv0">{title}</h3>
                    <h4 className="mt1 mv-atlas f7">{humanize}</h4>
                </div>
                <div className="br-100 flex-none" style={{backgroundImage: `url('${avatarUrl || avatar}')`}}></div>
            </header>
        </article>
    )
}