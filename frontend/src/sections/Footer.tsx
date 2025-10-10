export default function Footer(){
  return (
    <footer className="border-t border-zinc-800/60 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="text-sm text-zinc-400">© {new Date().getFullYear()} Deshwal Waste Management</div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hover:text-primary">LinkedIn</a>
          <a href="#" className="hover:text-primary">Twitter/X</a>
          <a href="#" className="hover:text-primary">Facebook</a>
        </div>
      </div>
    </footer>
  )
}



