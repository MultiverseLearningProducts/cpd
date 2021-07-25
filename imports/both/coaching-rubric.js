export const coachingRubric = [
    {value: 'credibility', label: 'Credibility'},
    {value: 'reliability', label: 'Reliability'},
    {value: 'openness', label: 'Openness'},
    {value: 'orientation', label: 'Orientation'},
    {value: 'building-ownership', label: 'Building Ownership'},
    {value: 'effective-preparation', label: 'Effective Preparation'},
    {value: 'contracting', label: 'Contracting'},
    {value: 'group-contracting', label: 'Group Contracting'},
    {value: 'apprentice-expectations-motivation', label: 'Apprentice Expectations and Motivation'},
    {value: 'line-manager-expectations-motivation', label: 'Line Manager Expectations and Motivation'},
    {value: 'organisational-skills', label: 'Organisational Skills'},
    {value: 'connection-mv-offer', label: 'Connecting with the full MV offer'},
    {value: 'assessment-for-learning', label: 'Assessment for Learning'},
    {value: 'energy-gravitas', label: 'Energy and Gravitas'},
    {value: 'curiosity', label: 'Curiosity'},
    {value: 'coaching-technique', label: 'Coaching Technique'},
    {value: 'meaningful-objectives', label: 'Meaningful Objectives'},
    {value: 'no-surprises', label: 'No Surprises'},
    {value: 'data-informed-decision-making', label: 'Data Informed Decision Making'},
    {value: 'effective-challenge', label: 'Effective Challenge'},
    {value: 'culture-of-quality-feedback', label: 'Culture of Quality Feedback'}
]

export const coachingRubricLabels = Object.keys(coachingRubric).map(key => coachingRubric[key].label)