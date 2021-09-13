import React from 'react'
import { Radar, Scatter } from 'react-chartjs-2'
import { BalanceChart } from '../stats-panel/BalanceChart'
import { format } from 'date-fns'
import 'chartjs-adapter-date-fns'
import { enGB } from 'date-fns/locale'

export const FocusStats = ({data}) => {
    const radarOptions = {
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
        }
    }
    const radarData = {
        labels: data.radarData.labels,
        datasets: [{
            data: data.radarData.data,
            fill: true,
            backgroundColor: 'rgba(255,124,102, 0.8)',
            borderColor:'rgba(255,124,102, 1)',
            pointRadius: 6,
            pointBorderColor: '#f4f4f4',
            borderCapStyle: 'round',
            tension: .1
        }],
    }
    const scatterData = data.frequencyData
    const scatterOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        return `${format(new Date(ctx.raw.x),'eee do MMM')} - ${ctx.raw.r}`
                    }
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
                borderColor: '#242456'
            },
            stepped: true
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
                },
                showLine: true,
                ticks: {
                    source: 'auto'
                }
            },
            y: {
                type: 'linear',
                min: 1,
                max: 3,
                display: true,
                showLine: true,
                ticks: {
                    display: false
                }
            }
        }
    }

    return (
        <section>
            <article className="bg-mv-white-dwarf br3 pa3">
                <Radar data={radarData} options={radarOptions} hight="40vw" width="40vw" />
            </article>
            <article className="bg-mv-white-dwarf br3 pa3 mt3">
                <BalanceChart data={data} />
            </article>
            <article className="bg-mv-white-dwarf br3 pa3 mt3">
                <Scatter data={scatterData} options={scatterOptions} width="100%" height="120" />
            </article>
        </section>
    )
}