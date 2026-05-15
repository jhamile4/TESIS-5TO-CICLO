import Navbar from '../../components/Navbar/Navbar'
import Hero from './Hero'
import Beneficios from './Beneficios'
import Directorio from './Directorio'
import Pasos from './Pasos'
import './Hero.css'
import './Beneficios.css'
import './Directorio.css'
import './Pasos.css'  
import HerramientasIA from './HerramientasIA'  

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Beneficios />  
      <Directorio />  
      <Pasos />
      <HerramientasIA />
    </div>
  )
}

export default LandingPage