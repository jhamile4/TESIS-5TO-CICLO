import Navbar from '../components/Navbar/Navbar'

// Layout compartido para páginas que NO son la LandingPage
// Muestra el Navbar arriba y el contenido de la página debajo
function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default PageLayout
