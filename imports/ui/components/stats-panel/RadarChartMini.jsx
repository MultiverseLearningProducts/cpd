import React, { useContext } from 'react'
import { Radar } from 'react-chartjs-2'

export const RadarChartMini = props => {
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
                ticks: {
                    display: false
                },
                angleLines: {
                    display: true
                },
                pointLabels: {
                    display: false
                },
                suggestedMin: 0
            }
        }
    }

    const data = {
        labels: props.data.labels,
        datasets: [{
            data: props.data.data,
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
        <section id="mini-radar" className="pointer" onClick={() => props.openFocusPanelWith()}>
            <Radar data={data} options={options} height="120" width="100%" />
        </section>
    )
}