import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="logo">
              <div className="logo__mark">V</div>
              <span className="logo__name">Voyage<span className="logo__dot">.</span></span>
            </Link>
            <p className="footer__tagline">
              Private transfers in 150+ countries. Real drivers. Real competition. Transparent prices.
            </p>
            <div className="footer__social">
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">ig</a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <a href="#" className="footer__link">Airport Transfers</a>
            <a href="#" className="footer__link">Intercity Rides</a>
            <a href="#" className="footer__link">VIP & Business</a>
            <a href="#" className="footer__link">Group Transfers</a>
            <a href="#" className="footer__link">Hourly Charter</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <Link href="/about"        className="footer__link">About Us</Link>
            <Link href="/how-it-works" className="footer__link">How It Works</Link>
            <Link href="/driver"       className="footer__link">Become a Driver</Link>
            <a href="#" className="footer__link">Press</a>
            <a href="#" className="footer__link">Careers</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Support</h4>
            <a href="#" className="footer__link">Help Center</a>
            <a href="#" className="footer__link">Contact Us</a>
            <a href="#" className="footer__link">Safety</a>
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Voyage Technologies Ltd. All rights reserved.</span>
          <span>Registered in Cyprus · VAT: CY12345678</span>
        </div>
      </div>
    </footer>
  )
}
