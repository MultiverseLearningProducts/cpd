import React, { useContext } from 'react'
import { Radar } from 'react-chartjs-2'
import { coachingRubricLabels } from '../../../both/coaching-rubric'
import { DispatchContext } from '../focus-panel/FocusPanel'

export const RadarChartMini = props => {
    const genRandData = new Array(21).fill(0).map(n => Math.round(Math.random() * 20) + 1)
    const dispatch = useContext(DispatchContext)
    const options = {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: ctx => ctx.raw
                },
                backgroundColor: '#242456',
                displayColors: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            },
            r: {
                angleLines: {
                    display: true
                },
                pointLabels: {
                    display: false
                }
            }
        },
        animations: {
            tension: {
                duration: 2600,
                easing: 'linear',
                from: .3,
                to: -0.3,
                loop: true
            }
        }
    }
    const data = {
        labels: coachingRubricLabels,
        datasets: [{
            data: genRandData,
            fill: true,
            backgroundColor: 'rgba(255,124,102, 0.8)',
            borderColor:'rgba(255,124,102, 1)',
            pointRadius: 6,
            pointBorderColor: '#f4f4f4',
            borderCapStyle: 'round',
            tension: .1
        }],
    }
    return (
        <section id="mini-radar" onClick={() => dispatch({type: 'open_focus_panel', heading: 'Your Strengths', content: data})}>
            <Radar data={data} options={options} height="120" width="100%" />
        </section>
    )
}