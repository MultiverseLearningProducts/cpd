import React from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {coachingRubric} from '../../../both/coaching-rubric'

const animatedComponents = makeAnimated()

export const CoachRubricTags = props => {
    const multiverseStyles = {
        multiValue: styles => ({...styles, backgroundColor: '#ff7c66'}),
        multiValueLabel: styles => ({...styles, color: '#f4f4f4'}),
        multiValueRemove: styles => ({...styles, color: '#f4f4f4'})
    }
    return <Select
        value={props.value}
        placeholder='Tag with the rubric'
        className='flex-auto tl'
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={coachingRubric}
        isMulti
        isSearchable
        styles={multiverseStyles}
        onChange={props.onChange} />
}
