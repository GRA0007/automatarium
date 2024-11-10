import React, { useState } from 'react'
import { Github, HelpCircle } from 'lucide-react'

import { Sections, Section, Banner } from './landingStyle'
import { Main, Button, Header, Table, ProjectCard } from '/src/components'
import TourButton from '/src/components/TourButton/TourButton'

import ExampleAutomaton from './components/ExampleAutomaton'
import TestingLab from './components/TestingLab'

import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'
import LandingPageTour from '../Tutorials/guidedTour/LandingPageTour'

const Landing = () => {
  // creating booleans for tour
  const [showTour, setShowTour] = useState(false)
  const [Step, setStep] = useState(0)

  const scrollToArea = (step: number) => {
    // const element = document.getElementById('start-build');
    // if (element) {
    //   element.scrollIntoView({   behavior: 'smooth', block: 'start' });
    // }
    if (step === 1) {
      window.scrollTo({ top: 10, behavior: 'smooth' })
    } else if (step === 2) {
      window.scrollTo({ top: 10, behavior: 'smooth' })
    } else if (step === 3) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 4) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 5) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 6) {
      window.scrollTo({ top: 1200, behavior: 'smooth' })
    }
  }

  const handleBannerStep = (step: number) => {
    // Define the behavior when the tour reaches the banner step
    if (step) {
      // setIsBannerStep(true);
      scrollToArea(step)
      setStep(step)
    }
  }

  const startTour = () => {
    setShowTour(true)
  }

  const closeTour = () => {
    setShowTour(false)
    setStep(0)
  }

  return (
  <Main fullWidth style={{ paddingBottom: 0 }}>
    <Header center />
    <Sections>
      <Section>
        <ExampleAutomaton />
        <div className="text">
          <p>Automatarium is a student-built platform for automata and formal language theory.</p>
          <p>Work easily with a simple and intuitive design built for ease of use and accessibility.</p>
          <p>It's free to use, and when you're done, share your project with the world with a link.</p>
          <Button id="start-build" to="/new"
            style={{
              backgroundColor: (Step === 1) ? '#90EE90' : '',
              color: (Step === 1) ? 'green' : 'white'
            } }
          >Start building!</Button>
          <p>First time here? Check out our tutorials!</p>
          <Button to='/tutorials'
          style={{
            backgroundColor: (Step === 2) ? '#90EE90' : '',
            color: (Step === 2) ? 'green' : 'white'

          } }>Tutorials</Button>
        </div>
      </Section>

      <Banner>
        <h3>Automatarium is open-source and free</h3>
        <p>Licensed under MIT, and hosted by RMIT University for everyone to use</p>
        <Button
          icon={<Github />}
          href="https://github.com/automatarium/automatarium"
          target="_blank"
          rel="nofollow noreferrer"
        >Visit Github</Button>
      </Banner>

      <Section $reverse>
        <TestingLab Step={Step} />
        <div className="text">
          <h3>Fully-featured testing lab</h3>
          <p>Automatarium provides a simple but powerful testing lab. Step through inputs and see a live trace of what is happening. Try changing the input in the example and see what happens.</p>
          <p>There is also a multi-run feature, run many tests at once and see which succeed and fail.</p>
        </div>
      </Section>

      <Section>
        <Table>
          <tbody>
            <tr><th>&delta;</th><th>a</th><th>b</th></tr>
            <tr><th>q0</th><td>q1</td><td>-</td></tr>
            <tr><th>q1</th><td>-</td><td>q2</td></tr>
            <tr><th>q2</th><td>-</td><td>-</td></tr>
          </tbody>
        </Table>
        <div className="text">
          <h3>Explore your automata</h3>
          <p>Automatarium provides tools to inspect your automaton and learn about how it reacts to different inputs.</p>
        </div>
      </Section>

      <Section $reverse>
        <ProjectCard name="My Project" type="FSA" date="2 days ago" disabled width={PROJECT_THUMBNAIL_WIDTH} $istemplate={false}/>
        <div className="text">
          <h3>Share with colleagues</h3>
          <p>Easily share your projects with your peers via a link that lets anyone make a copy of your project and continue working.</p>
        </div>
      </Section>

    <Banner>
          <h3>What are you waiting for?</h3>
          <p>Start building and testing your automata now!</p>
          <Button to="/new">Start building!</Button>
    </Banner>
    </Sections>

    <TourButton
      icon={<HelpCircle />}
      onClick={startTour}>
    </TourButton>

    {/* Render the tour if showTour is true */}
    {showTour && <LandingPageTour onClose={closeTour} Step={handleBannerStep} />}
    </Main>
  )
}

export default Landing
