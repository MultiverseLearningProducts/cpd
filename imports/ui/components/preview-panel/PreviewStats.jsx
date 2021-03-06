import React, { useContext } from 'react'
import { Tag, TagCount } from '../misc/Tag'
import { FrequencyChart } from '../stats-panel/FrequencyChart'
import { RadarChartMini } from '../stats-panel/RadarChartMini'
import { DispatchContext } from '../focus-panel/FocusPanel'
import { coachingRubricLabels } from '../../../both/coaching-rubric'
import { differenceInDays } from 'date-fns'


const sortedScores = observations => {
    const unsorted = observations
        .map(({ tags }) => tags)
        .flat()
        .reduce((memo, tag) => {
            tag.value in memo ? memo[tag.value]++ : memo[tag.value] = 1
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

function formatObservationsData(observations, email, asObserver) {
    const getData = (ob) => {
        const {calEvt_date, observer, observed, tags} = ob
        const daysAgo = differenceInDays(new Date(), new Date(calEvt_date))
        const tooltip = asObserver
        ? `observing ${observer.name} ${daysAgo} days ago`
        : `observed by ${observer.name} ${daysAgo} days ago gained ${tags.length} tag${tags.length === 1 ? '' : 's'} `
        return {
            x: new Date(calEvt_date).getTime(),
            y: (asObserver ? observer.email : observed.email) === email ? 2 : 0,
            r: tooltip
        }
    }
    return {
        label: asObserver ? 'observations given' : 'observations received',
        data: observations.map(getData),
        backgroundColor: asObserver ? '#59d8a1' : '#ff7c66'
    }
}

function formatTagsData(observations, email) {
    const tags = observations
        .map(ob => ob.tags.map(t => t.label))
        .filter(tags => tags.length)
        .flat()
        .sort()

    const labels = coachingRubricLabels.map(rubric => tags.reduce((memo, tag) => {
        if (tag === rubric) memo++
        return memo
    }, 0))

    return labels.every(d => d === 0) ? [] : labels
}

export const PreviewStats = props => {
    const dispatch = useContext(DispatchContext)
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

    const currentlySelectedObservations = observations.filter(ob => ob.observed.email === email)

    const scores = sortedScores(currentlySelectedObservations)
    
    const radarData = {
        labels: coachingRubricLabels,
        data: formatTagsData(currentlySelectedObservations)
    }

    const frequencyData = {
        datasets: [
            formatObservationsData(observations, email),
            formatObservationsData(observations, email, true)
        ]
    }
    const openFocusPanelWith = () => {
        const data = {
            observations,
            email,
            radarData,
            frequencyData
        }
        dispatch({type: 'open_focus_panel', heading: 'Your Strengths', content: data})
    }

    return (
        <section id="preview-stats">
            {/* <RadarChartMini data={radarData} openFocusPanelWith={openFocusPanelWith} /> */}
            <h2>Your coaching strengths</h2>
            <article className="br3 pa3 bg-mv-white-dwarf lh-copy">
                {scores.length
                    ? scores.map(([tag, score]) => {
                        return (
                            <div key={`${score}-${tag}`}>
                                <TagCount tag={{ label: score }} /><Tag tag={{ label: tag }} />
                            </div>
                        )
                    })
                    : <p>Once you begin to receive feedback from other coaches you will begin to build up a coaching profile. Your profile will be accessible here. The way your profile grows depends upon coaches observing you applying the coaching rubric we practice at Multiverse. When a coach observes your session they will be looking at how you apply aspects of the rubric. That will form the basis of their feedback and your observer will tag the sessions they observe with the aspects of the rubric they have seen you demonstrate.</p>}
            </article>
            <FrequencyChart data={frequencyData} openFocusPanelWith={openFocusPanelWith} />
        </section>
    )
}