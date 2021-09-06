import React from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {coachingRubric} from '../../both/coaching-rubric'

const animatedComponents = makeAnimated()

export const CoachRubricTags = props => {
    return <Select
        placeholder='Tag with the rubric'
        className='flex-auto tl'
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={coachingRubric}
        isMulti
        isSearchable
        onChange={props.onChange} />
}
