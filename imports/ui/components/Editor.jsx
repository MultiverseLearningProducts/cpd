import React, { useRef, useEffect } from 'react'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

export const Editor = props => {
    const editor = useRef()

    const getInstance = sunEditor => {
        editor.current = sunEditor
    }

    const options = {
        buttonList: [
            ['undo', 'redo'],
            ['fontSize'],
            ['fontColor'],
            ['bold', 'underline', 'italic'],
            ['align'],
            ['horizontalRule', 'list', 'link']
        ],
        fontSize: [12, 14, 18, 24],
        colorList: [
            '#4d61f4',
            '#ffe352',
            '#f4f4f4',
            '#ff7c66',
            '#64abff',
            '#242456',
            '#59d8a1',
            '#c8c8d5'           
        ],
        linkProtocol: 'link',
        width: '100%',
        maxWidth: '590px'
    }
    const style = `
        text-align: left;
        font-family: AtlasGrotesk-Regular, sans-serif;
        margin: auto;
    `

    return <SunEditor 
        getSunEditorInstance={getInstance} 
        setContents={props.defaultValue} 
        onChange={props.onChange} 
        placeholder={props.placeholder} 
        setOptions={options} 
        setDefaultStyle={style} />
}