import React, { useRef, useEffect, useState } from 'react'
import { useMethod } from '../../both/useMethod'
import { Network } from 'vis-network'

export const VisNetwork = () => {
	const [nodes, setNodes] = useState([])
	const [edges, setEdges] = useState([])
	const networkData = useMethod('getNetworkData')
	
	const visJsRef = useRef(null)
	
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
	
	useEffect(() => {
		const network = visJsRef.current && 
			new Network(visJsRef.current, { nodes, edges }, networkOptions)

		if (!nodes.length && !edges.length) {
			networkData.call()
			.then(({nodes, edges}) => {
				setNodes(nodes)
				setEdges(edges)
			})
			.catch(console.error)
		}
		if (network && nodes.length) network.on('selectNode', function (event) {
			const selectedNodes = event.nodes.map(id => nodes.find(node => node.id === id))
			console.log(selectedNodes)
		})
		network && network.setData({nodes, edges})
	}, [visJsRef, nodes, edges])

	const style = {
		height: `90vh`,
		width: `100%`,
		maxWidth: "100%",
		minWidth: "30%",
		// maxHeight: "512px",
		backgroundColor: "#c8c8d5",
		margin: "auto",
		border: "solid 0px transparent"
	}
	if (networkData.data === null || networkData.isLoading) return 'Fetching Data...'
	return <div ref={visJsRef} style={style}></div>
}
