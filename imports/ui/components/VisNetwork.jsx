import React, { useRef, useEffect, useState } from 'react'
import { useMethod } from '../../both/useMethod'
import VisNetworkReactComponent from 'vis-network-react'
import { NetworkInfoPanel } from './NetworkInfoPanel'

export const VisNetwork = props => {
	const { user } = props
	const [selected, setSelected] = useState(undefined)
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
			console.log('selectNode', id, this.focus)
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
				setSelected(_selected)
				if (_selected) {
					network.setSelection({nodes: [_selected.id]})
					network.focus(_selected.id, {scale: 0.8})
				}
			}
		}
		_network.on('afterDrawing', initNetwork)
	}

	return (
		<section id="network-graph" className="relative">
			<VisNetworkReactComponent style={style} events={events} data={profiles.data} options={networkOptions} getNetwork={getNetwork} />
			<aside className="bg-mv-supernova">
				{selected ? selected.data.fullName : ""}
			</aside>
		</section>
	)
}

// export const VisNetwork = props => {
// 	const user = props.user
// 	const [nodes, setNodes] = useState([])
// 	const [edges, setEdges] = useState([])
// 	const [selected, setSelected] = useState(undefined)
// 	const [closed, setClosed] = useState(true)
// 	const [networkLoaded, setNetworkLoaded] = useState(false)
// 	const networkData = useMethod('getProfiles')
// 	if (!nodes.length && !edges.length) networkData.call()
// 	const visJsRef = useRef(null)


// 	const network = visJsRef.current &&
// 		new Network(visJsRef.current, { nodes, edges }, networkOptions)

// 	console.log(networkData.data)
// 	if (network && networkData.data) {
// 		setNodes(networkData.data.nodes)
// 		setEdges(networkData.data.edges)
// 		network.setData({ nodes, edges })

// 		network.on('afterDrawing', function () {
// 			if (!networkLoaded) setNetworkLoaded(true)
// 		})

// 		network.on('selectNode', function (event) {
// 			const [selectedNodes] = event.nodes.map(id => nodes.find(node => node.id === id))
// 			setSelected(selectedNodes)
// 		})

// 		const userNode = nodes.find(node => node.data.email === user.services.google.email)
// 		setSelected(userNode)

// 		network.selectNodes([userNode.id])
// 	}

// 	const toggleNetworkInfoPanel = () => setClosed(!closed)

// 	let networkInfoPanelStyle = {
// 		transition: 'top .5s cubic-bezier(0.075, 0.82, 0.165, 1)',
// 		top: closed ? '80vh' : '0vh',
// 		bottom: closed ? '0px' : '65vh',
// 		minHeight: closed ? '6.5rem' : '85vh'
// 	}



// 	if (networkData.data === null || networkData.isLoading) return <div className="flex items-center justify-center" style={style}>Fetching data...</div>
// 	return (
// 		<section id="network-graph" className="relative">
// 			<article className={!networkData.isLoading ? "" : "network-loading"} ref={visJsRef} style={style}></article>
// 			<aside className="bg-mv-supernova" style={networkInfoPanelStyle}>
// 				{selected
// 					? <NetworkInfoPanel selected={selected} toggleNetworkInfoPanel={toggleNetworkInfoPanel} />
// 					: null}
// 			</aside>
// 		</section>
// 	)
// }
