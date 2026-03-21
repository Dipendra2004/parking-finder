interface FooterProps {
  logo: React.ReactNode
  brandName: string
  mainLinks?: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  mainLinks = [],
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/5 pt-12 pb-8 overflow-hidden z-20 mt-auto">
      {/* Subtle ambient glow top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          
          {/* Brand & Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="/"
              className="flex items-center gap-x-3 group"
              aria-label={brandName}
            >
              <div className="p-2.5 bg-[#111111] rounded-xl border border-white/5 shadow-md shadow-black/50 group-hover:border-white/10 transition-colors">
                {logo}
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-gray-200 transition-colors">
                {brandName}
              </span>
            </a>
            <p className="mt-5 text-sm text-gray-500 max-w-xs leading-relaxed">
              Smarter parking for the modern city. Find, reserve, and park with zero hassle. Designed specially for Navi Mumbai.
            </p>
          </div>

          {/* Links Arrays */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-20 text-center sm:text-left">
             {mainLinks.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-5 tracking-wide text-sm uppercase">Navigation</h4>
                <ul className="space-y-3.5">
                  {mainLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-gray-400 hover:text-[#3b82f6] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
             )}

            <div>
              <h4 className="font-semibold text-white mb-5 tracking-wide text-sm uppercase">Legal</h4>
              <ul className="space-y-3.5">
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-gray-400 hover:text-[#8b5cf6] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>{copyright.text}</span>
            {copyright.license && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{copyright.license}</span>
              </>
            )}
          </div>
          
          <div className="text-xs text-gray-600 tracking-wide">
            Powered By <span className="text-[#3b82f6]/80 font-medium">Dipendra Jaiswal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
