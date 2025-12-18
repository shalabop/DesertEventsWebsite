export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-display text-lg">Desert Events Arizona</div>
          <p className="text-[#C4C4C4] mt-2">Arizona’s leading nightlife & event collective.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Brands</div>
          <ul className="space-y-1">
            <li><a className="underline-offset-4 hover:underline" href="/scottsdale-guestlist">Scottsdale GuestList</a></li>
            <li><a className="underline-offset-4 hover:underline" href="/le-tour-de-crawl">Le Tour De Crawl</a></li>
            <li><a className="underline-offset-4 hover:underline" href="/society-sessions">Society Sessions</a></li>
            <li><a className="underline-offset-4 hover:underline" href="/tableworthy">Tableworthy</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Social</div>
          <ul className="space-y-1">
            <li><a className="underline-offset-4 hover:underline" href="https://instagram.com" target="_blank">Instagram</a></li>
            <li><a className="underline-offset-4 hover:underline" href="https://tiktok.com" target="_blank">TikTok</a></li>
            <li><a className="underline-offset-4 hover:underline" href="https://linkedin.com" target="_blank">LinkedIn</a></li>
            <li><a className="underline-offset-4 hover:underline" href="https://youtube.com" target="_blank">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-[#C4C4C4] py-4 border-t border-white/5">
        © Desert Events Arizona 2025
      </div>
    </footer>
  )
}
