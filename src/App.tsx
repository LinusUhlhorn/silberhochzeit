import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { BackToTopButton } from './components/BackToTopButton'
import { HeroSection } from './components/HeroSection'
import { IntroSection } from './components/IntroSection'
import { TimelineSection } from './components/TimelineSection'
import { StatsSection } from './components/StatsSection'
import { BeforeAfterSection } from './components/BeforeAfterSection'
import { FactsSection } from './components/FactsSection'
import { QuizSection } from './components/QuizSection'
import { GuestWallSection } from './components/GuestWallSection'
import { ClosingSection } from './components/ClosingSection'
import { Footer } from './components/Footer'

/**
 * One-Page-Website.
 *
 * Die Reihenfolge der Abschnitte ist bewusst gewaehlt:
 * erst Emotion, dann die Geschichte, dann das Mitmachen –
 * und zum Schluss wieder Emotion.
 *
 * Saemtliche Texte stehen in src/data/content.ts.
 * Die Gaestebeitraege kommen dagegen vom Server (public/api).
 */
export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main>
        <HeroSection />
        <IntroSection />
        <TimelineSection />
        <StatsSection />
        <BeforeAfterSection />
        <FactsSection />
        <QuizSection />
        <GuestWallSection />
        <ClosingSection />
      </main>

      <Footer />
      <BackToTopButton />
    </>
  )
}
