import { useTheme } from '../hooks/useTheme'
import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import ProblemStatement from '../sections/ProblemStatement'
import FeatureTabs from '../sections/FeatureTabs'
import StatsSection from '../sections/StatsSection'
import CTASection from '../sections/CTASection'
import Footer from '../sections/Footer'

export default function LandingPage() {
  // Initialize theme at top level
  useTheme()

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemStatement />
      <FeatureTabs />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
