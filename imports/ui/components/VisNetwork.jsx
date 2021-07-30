import React from 'react'
import VisNetworkReactComponent from 'vis-network-react'

export const VisNetwork = React.memo(props => {
	const { onSelect, data, setNetwork } = props

	const events = {
		click: function (params) {
			params.event = "[original event]"; 
			onSelect(this.getNodeAt(params.pointer.DOM))
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
			setNetwork(_network)
			Meteor.setTimeout(() => {
				for (edge of data.edges) {
					try {
						_network.body.data.edges.add(edge)
					} catch(err) {}
				}
				// Meteor.setTimeout(() => network.focus(_selected.id, {scale: 0.8}), 1800)
			}, 0)
		}
		_network.on('afterDrawing', initNetwork)
	}
	console.log('network-render')
	return (
		<section id="network-graph" className={`relative ${data ? '' : 'network-loading spinner'}`}>
			<VisNetworkReactComponent 
				style={style} 
				events={events} 
				data={{ nodes: data.nodes, edges: [] }} 
				options={networkOptions} 
				getNetwork={getNetwork} />
		</section>
	)
}, (oldProps, newProps) => {
	return newProps.data && oldProps.data.nodes.length === newProps.data.nodes.length
})
