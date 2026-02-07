import { useTheme } from '../hooks/useTheme'
import { useViewportScale } from '../hooks/useViewportScale'
import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import ProblemStatement from '../sections/ProblemStatement'
import ProfileShowcase from '../sections/ProfileShowcase'
import NoriShowcase from '../sections/NoriShowcase'
import FeatureTabs from '../sections/FeatureTabs'
import StatsSection from '../sections/StatsSection'
import CTASection from '../sections/CTASection'
import Footer from '../sections/Footer'

export default function LandingPage() {
  // Initialize theme at top level
  useTheme()
  const { zoom, isScaled } = useViewportScale()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <div
        style={
          isScaled
            ? ({
                width: 1100,
                zoom,
                '--page-zoom': zoom,
              } as React.CSSProperties)
            : undefined
        }
      >
        <Hero />
        <ProblemStatement />
        <ProfileShowcase />
        <NoriShowcase />
        <FeatureTabs />
        <StatsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
