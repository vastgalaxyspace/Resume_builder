import { Mail } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1E1E2E] bg-[#0A0A0F] mt-24">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7C5CFC] flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-transparent font-semibold">
                ResumeIQ
              </span>
            </div>
            <p className="text-sm text-[#8888A0] mb-6 max-w-sm">
              AI-powered resume analysis that helps you land your dream job. Compare your resume against live market data and get actionable insights.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:border-[#4F8EF7] hover:bg-[#1A1A24] transition-all duration-200"
              >
                <FaTwitter size={18} className="text-[#8888A0]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:border-[#4F8EF7] hover:bg-[#1A1A24] transition-all duration-200"
              >
                <FaLinkedin size={18} className="text-[#8888A0]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:border-[#4F8EF7] hover:bg-[#1A1A24] transition-all duration-200"
              >
                <FaGithub size={18} className="text-[#8888A0]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:border-[#4F8EF7] hover:bg-[#1A1A24] transition-all duration-200"
              >
                <Mail size={18} className="text-[#8888A0]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#F0F0F5] mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F0F0F5] mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F0F0F5] mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#8888A0] hover:text-[#4F8EF7] transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E1E2E] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#44445A]">
            © {currentYear} ResumeIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#44445A] hover:text-[#8888A0] transition-colors">
              Status
            </a>
            <a href="#" className="text-sm text-[#44445A] hover:text-[#8888A0] transition-colors">
              Changelog
            </a>
            <a href="#" className="text-sm text-[#44445A] hover:text-[#8888A0] transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}