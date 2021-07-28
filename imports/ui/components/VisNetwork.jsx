import React, { useEffect, useState } from 'react'
import { useMethod } from '../../both/useMethod'
import VisNetworkReactComponent from 'vis-network-react'
import { NetworkInfoPanel } from './NetworkInfoPanel'

export const VisNetwork = props => {
	const { user } = props
	const [networkRendered, setNetworkRendered] = useState(false)
	const [selected, setSelected] = useState(null)
	const profiles = useMethod('getProfiles')
	let network = undefined
	
	useEffect(() => {
		profiles.call()
	}, [])

	if (!profiles.data) return <div>Fetching data...</div>
	if (profiles.isLoading) return <div>Loading data...</div>

	const events = {
		click: function (params) {
			params.event = "[original event]";
			const id = this.getNodeAt(params.pointer.DOM)
			const _selected = profiles.data.nodes.find(n => n.id === id)
			setSelected(_selected)
		},
		selectNode: function (params) {
			const [id] = params.nodes
		}
	}

	const networkOptions = {
		layout: {
			improvedLayout: false
		},
		physics: {
			barnesHut: {
				gravitationalConstant: -4000
			}
		}
	}

	const style = {
		position: 'relative',
		height: `85vh`,
		width: `100%`,
		maxWidth: "100%",
		minWidth: "30%",
		backgroundColor: "#c8c8d5",
		margin: "1rem auto 0",
		border: "solid 0px transparent"
	}

	const getNetwork = _network => {
		const initNetwork = () => {
			_network.off(initNetwork)
			if (!network) {
				network = _network
				const _selected = profiles.data.nodes.find(n => n.data.email === user.services.google.email)
				if (_selected) {
					setSelected(_selected)
					network.setSelection({nodes: [_selected.id]})
					network.focus(_selected.id, {scale: 0.8})
					setNetworkRendered(true)
				}
			}
		}
		_network.on('afterDrawing', initNetwork)
	}

	return (
		<section id="network-graph" className={`relative ${networkRendered ? '' : 'network-loading spinner'}`}>
			<VisNetworkReactComponent style={style} events={events} data={profiles.data} options={networkOptions} getNetwork={getNetwork} />
			{selected ? <NetworkInfoPanel selected={selected} profiles={profiles.data} /> : null}
		</section>
	)
}
