import React from 'react'
import { Radar } from 'react-chartjs-2'
import { coachingRubricLabels } from '../../both/coaching-rubric'

export const RadarChart = props => {
    const genRandData = new Array(21).fill(0).map(n => Math.round(Math.random() * 20) + 1)
    const data = {
        labels: coachingRubricLabels,
        datasets: [{
            label: `${props.selected.data.firstName}'s 'Coaching Spider'`,
            data: genRandData,
            fill: true,
            backgroundColor: 'rgba(255,124,102, 0.2)',
            borderColor:'rgba(255,124,102, 1)',
            pointBorderColor: '#ffe352',
            borderCapStyle: 'round',
            tension: .1
        }],
    }

    return (
        <section id="radar-chart" className="bg-mv-white-dwarf ph2 ml-auto mr-auto w-100">
            <Radar data={data} width='100%' height='480px'/>
        </section>
    )
}