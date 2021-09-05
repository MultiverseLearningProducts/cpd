class Node {
    constructor(employee) {
        this.id = employee.id
        this.borderWidth = 1
        this.borderWidthSelected = 2
        this.brokenImage = 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
        this.color = {
            border: '#4d61f4',
            background: '#64abff',
            highlight: {
                border: '#FFE352',
                background: '#ffe352'
            },
            hover: {
                background: '#ffe352'
            }
        }
        this.font = {
            color: '#242456',
            size: 14,
            face: 'AtlasGrotesk-Regular',
            align: 'center'
        }
        this.shape = 'hexagon'
        this.imagePadding = {
            left:0,
            top:0,
            bottom:0,
            right:0
        }
        this.label = employee.displayName
        this.data = {...employee}
    }
}

class Edge {
    constructor(node1, node2) {
        this.id = [node1, node2].join('-')
        this.from = node1
        this.to = node2
    }
}

export function createForNetwork (data) {
    const nodes = data
        .map(employee => new Node(employee))
        .filter(employee => employee.data.work.department === 'Learning , Innovation & Operations')
        .map(employee => {
            const hasCoachRole = [
                'emma.arlow@multiverse.io',
                'stephanie.wright@multiverse.io',
                'stephanie.trattles@multiverse.io',
                'kristina.raissi@multiverse.io',
                'sean.landes@multiverse.io',
                'greg.west@multiverse.io',
                'jacqueline.chan@multiverse.io',
                'nejmi.alexander@multiverse.io'
            ]
            const isCoach = employee.data.work.title.toLowerCase().includes('coach')
            || hasCoachRole.includes(employee.data.email)
            const background = isCoach ? '#64abff' : '#c8c8d5'
            employee.color.background = background
            return employee
        })
    
    const edges = nodes.map(employee => {
        try {
            return new Edge(employee.data.work.reportsTo.id, employee.id)
        } catch(err) {
            return null
        }
    }).filter(employee => employee)
    return {nodes, edges}
}
