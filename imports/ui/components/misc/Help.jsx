import React from 'react'
import './help.css'
import { JournalIcon, TargetIcon, CalIcon } from './Icons'

export const Help = () => {
    return (
        <section>
            <header id="#header" className="flex justify-end items-center bb b--white">
                <span className="dib"><img src="/observatory-header.svg" alt="the observatory" style={{maxWidth: '12rem'}}className="ml3 v-mid"/></span>
                <span className="dib flex-auto mv-white ml3">The help page</span>
            </header>
            <main id="help" className="pa3 br3 overflow-y-scroll">
                <section className="bg-mv-white-dwarf pa3 br3">
                    <h1 className="tc">Welcome to the Observatory</h1>
                    <blockquote>This is where you come to observe the stars of Multiverse</blockquote>
                    <p>This help page is your place to start. The app has 3 components to help you grow and develop your coaching practice here at Multiverse.</p>
                    <h2>Journal Stats and Observations</h2>
                    <img src="https://user-images.githubusercontent.com/4499581/135095914-40c4b5e5-a80d-45b4-9cb0-dd5f95253105.png" className="w-100" />
                    <p><span className="cb fl"><JournalIcon /></span><strong>Your journal</strong> is where you can record your reflections on your coaching practice, and read the feedback from your peers. It is a public journal. As a community of coaches we want to share our journey. Your reflections can help and inspire other coaches, and you will also have access to all the thinking and practice that has gone before you.</p>
                    <p><span className="cb fl"><TargetIcon /></span><strong>Your coaching metric</strong> is built up over time as other coaches observe you demonstrating aspects of the coaching rubric. Use this chart to help identify the strengths you have demonstrated and areas that you might need to work on. The observatory expects you to give observations as well as receive them, you will have a measure here that helps you keep track of observations given and received try to keep it balanced. Finally the cadence of your observations will also be something to keep an eye on. Aim for 1 observation given and 1 received each month.</p>
                    <p><span className="cb fl"><CalIcon /></span><strong>Observations in your Google calendar</strong> you can manage reflections and feedbacks here. Booked observations will appear here, and observations that have taken place and need your feedback you'll be able to see and manage here. To mark a calendar event so that it appears here use the text <span className="b code">(obs)</span> in your event title and we should pick it up in the Observatory. If you are the organiser of the google event you will be considered the coach being observed. We invite observation. If you are a guest to an event labeled <span className="b code">(obs)</span> you are the observer and will provide feedback and tag that session.</p>
                    <h2>The flow</h2>
                    <p>Book an observation, in your calendar invite a coach to come and watch you. Label the event with <span className="b code">(obs)</span> after the event has passed, come to 'The Observatory' and find the calendar event in the observations section, when you click on this you will be able to add your reflection.</p>
                    <img src="https://user-images.githubusercontent.com/4499581/135507297-f89f7136-b382-4455-8fd9-5510928b72cb.jpg" alt="an example of the reflection form"/>
                    <p>Select the type of session you are reflecting on. Add your thoughts, you can add links, bullet points and other styling to make your entry more readable. If you have a recording you can copy the sharing information and paste it into the recording URL field.</p>
                    <img src="https://user-images.githubusercontent.com/4499581/135505795-d44aaba5-8ea4-4520-bd2f-e9dfe59029e6.png" alt="the shareing info from zoom"/>
                    <h3>Video Consent</h3>
                    <p>⚠️ On the recording capture everyone giving verbal consent for the recording. The consent to request is something like the following:</p>
                    <p className="pa2 b i">"We would like to record this session and use the recording for training purposes. The recording will be stored for upto 5 years and will be accessible to other Multiverse coaches during that time. Will you give your consent for a record of our session to be used like this. If you have objections you may request for me to not record the session."</p>
                    <p>Recordings of observations will bring some rigor to our coach scoring system. We want to create an audit trail linking rubric tags with corresponding video evidence of that aspect of the rubric being demonstrated in the recording. This will help other coaches searching for examples of a particular skill from the rubric find your recording. However not every session needs to have a recording.</p>
                    <p>Once your reflection is complete your observing partner can add their feedback, and tag any elements of the rubric they observed you demonstrating.</p>
                    <h2>Your Score</h2>
                    <p>It will take time to build out your coaching score. As you collect observation tags you will see your score creep up, try and get the complete set from the Rubic.</p>
                    <h2>Go book some observations</h2>
                    <p>Ready to start? Go book an observation. Along with your radar chart we have also given you a quick way to judge the cadence and balance of your observations. You want the observation sessions given and received to be roughly 50:50 and the frequency about 1 observation given and 1 observation received each month. If you have more questions please ask either Victoria Welsh or Bernard Mordan. Good luck on your journey into 'The Observatory'.</p>
                </section>
            </main>
        </section>
    )
}