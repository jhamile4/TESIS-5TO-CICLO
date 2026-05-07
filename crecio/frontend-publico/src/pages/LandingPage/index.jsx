import Navbar from '../../components/Navbar/Navbar'
import Hero from './Hero'
import Beneficios from './Beneficios'
import Directorio from './Directorio'
import Pasos from './Pasos'
import './Hero.css'
import './Beneficios.css'
import './Directorio.css'
import './Pasos.css'    

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Beneficios />  
      <Directorio />  
      <Pasos />
    </div>
  )
}

export default LandingPage