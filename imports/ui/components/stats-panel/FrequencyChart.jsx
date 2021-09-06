import React from 'react'
import { Scatter } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { differenceInDays } from 'date-fns'
import { enGB } from 'date-fns/locale'

function formatObservationsData(observations, email, asObserver) {
    const getData = (ob) => {
        const {calEvt_date, observer, observed, tags} = ob
        const daysAgo = differenceInDays(new Date(), new Date(calEvt_date))
        const tooltip = asObserver
        ? `observing ${observer.email.split('.')[0]} ${daysAgo} days ago`
        : `observed by ${observer.email.split('.')[0]} ${daysAgo} days ago gained ${tags.length} tag${tags.length === 1 ? '' : 's'} `
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

export const FrequencyChart = ({ observations, email }) => {
    if (!observations.length) {
        return (
            <p className="br3 bg-mv-white-dwarf pa3 lh-copy">
                Its good to maintain a regular cadence of observations. You should be observing other coaches and having them come what you as well. When you have captured your first observations a frequency chart that will display here will help you keep track of your observation sessions and there cadence.
            </p>
        )
    }
    const options = {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: ctx => ctx.raw.r
                },
                backgroundColor: '#242456',
                displayColors: false
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 5,
                borderWidth: 1,
                borderColor: '#f4f4f4'
            }
        },
        scales: {
            x: {
                type: 'time',
                adapters: {
                    date: {
                        locale: enGB
                    }
                },
                time: {
                    unit: 'week'
                }
            },
            y: {
                type: 'linear',
                min: 1,
                max: 3,
                display: false
            }
        }
    }
    const data = {
        datasets: [
            formatObservationsData(observations, email),
            formatObservationsData(observations, email, true)
        ]
    }
    return (
        <section id="frequency-chart" className="mt3">
            <h2>Observations Frequency Chart</h2>
            <Scatter data={data} options={options} width="200" height="120" />
        </section>
    )
}