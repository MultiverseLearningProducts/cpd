import React from 'react'
import { Radar } from 'react-chartjs-2'

export const RadarChart = props => {
    const genRandData = new Array(21).fill(0).map(n => Math.round(Math.random() * 20) + 1)
    const data = {
        labels: ["scaffolding", "contracting", "sequencing", "blended_learning", "explanation", "modelling", "practice", "questioning", "language", "expertise", "adding_value", "managing_error", "stretch_n_challenge", "checking_for_understanding", "responsive_delivery", "feedback", "target_setting", "growth_mindset", "praise_n_positive_framing", "the_joy_factor", "purpose_n_pace"],
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
        <section id="radar-chart" className="mw6 ml-auto mr-auto w-100">
            <Radar data={data} width='100%' height='480px'/>
        </section>
    )
}