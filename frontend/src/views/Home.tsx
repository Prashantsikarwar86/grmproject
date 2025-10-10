import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Services from '@/sections/Services'
import Reports from '@/sections/Reports'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'

export default function Home(){
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="pt-[64px]">
        <Hero />
        <About />
        <Services />
        <Reports />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}



