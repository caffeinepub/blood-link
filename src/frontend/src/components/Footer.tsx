import { Droplets } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-white">
                Blood Link
              </span>
            </div>
            <p className="text-sm text-white/70">
              Connecting blood donors with recipients and hospitals in
              real-time. Every drop counts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/find-blood"
                  className="hover:text-white transition-colors"
                >
                  Find Blood
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Emergency Hotline</h4>
            <p className="text-sm text-white/70 mb-1">24/7 Blood Emergency</p>
            <p className="text-primary font-bold text-lg">1-800-BLOOD-HELP</p>
            <p className="text-sm text-white/70 mt-2">
              bloodlink@healthcare.org
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {year} Blood Link. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
