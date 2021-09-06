import React from 'react'
import { Tag, TagCount } from '../misc/Tag'
import { FrequencyChart } from '../stats-panel/FrequencyChart'

const sortedScores = observations => {
    const unsorted = observations
        .map(({ tags }) => tags)
        .flat()
        .reduce((memo, tag) => {
            memo[tag.value]
                ? memo[tag.value] = memo[tag.value] + 1
                : memo[tag.value] = 1
            return memo
        }, {})
    return Object
        .keys(unsorted)
        .sort((a, b) => {
            if (unsorted[a] > unsorted[b]) return -1
            if (unsorted[a] < unsorted[b]) return 1
            return 0
        })
        .map(k => [k, unsorted[k]])
}

export const PreviewStats = props => {
    const {
        previewPanel: {
            user: {
                data: {
                    email
                }
            }
        },
        observations = []
    } = props
    return (
        <section id="preview-stats">
            <button className="b--transparent ba bw1 b--mv-deep-space br3 mb3 w-100 tc pv3 mv-deep-space bg-mv-electron shadow-3 mv-atlas-mid f3">
                Open Coaching Profile
            </button>
            <article className="br3 pa3 bg-mv-white-dwarf lh-copy">
                {observations.length
                    ? sortedScores(observations).map(([tag, score]) => {
                        return (
                            <div key={`${score}-${tag}`}>
                                <TagCount tag={{ label: score }} /><Tag tag={{ label: tag }} />
                            </div>
                        )
                    })
                    : <p>Once you begin to receive feedback from other coaches you will begin to build up a coaching profile. Your profile will be accessible here. The way your profile grows depends upon coaches observing you applying the coaching rubric we practice at Multiverse. When a coach observes your session they will be looking at how you apply aspects of the rubric. That will form the basis of their feedback and your observer will tag the sessions they observe with the aspects of the rubric they have seen you demonstrate.</p>}
            </article>
            <FrequencyChart observations={observations} email={email} />
        </section>
    )
}