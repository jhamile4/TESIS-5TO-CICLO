import Navbar from '../../components/Navbar/Navbar'
import Hero from './Hero'
import Galeria from './Galeria'
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
      <Galeria />
      <Beneficios />
      <Directorio />
      <Pasos />
      <HerramientasIA />
      <Planes />
      <Testimonios />
      <CTAFinal />
      <Footer />
    </div>
  )
}

export default LandingPage