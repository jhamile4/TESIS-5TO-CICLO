// Página principal de CRECIO
// Compone todas las secciones en orden: Hero, Beneficios, Directorio, Pasos, IA, Planes, Testimonios, CTA
// Incluye su propio Navbar y Footer (no usa PageLayout)
import Navbar from '../../components/Navbar/Navbar'
import Hero from './Hero'
import Beneficios from './Beneficios'
import Directorio from './Directorio'
import Pasos from './Pasos'
import HerramientasIA from './HerramientasIA'
import Planes from './Planes'
import Testimonios from './Testimonios'
import CTAFinal from './CTAFinal'
import Footer from '../../components/Footer/Footer'

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Beneficios />
      <div id="directorio"><Directorio /></div>
      <div id="pasos"><Pasos /></div>
      <HerramientasIA />
      <div id="planes"><Planes /></div>
      <Testimonios />
      <CTAFinal />
      <Footer />
    </div>
  )
}

export default LandingPage