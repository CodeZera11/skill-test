"use client"

import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="space-y-4">
            <div>
              <Link href="/" className="flex items-center gap-0 -ml-4">
                <Image
                  src="/logo.png"
                  alt="SkillTest logo"
                  width={72}
                  height={72}
                  priority
                />
                <div className="flex flex-col -ml-1">
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
                    SkillTest
                  </span>
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xs font-light italic text-transparent -mt-1">
                    Let&apos;s Practice together
                  </span>
                </div>
              </Link>
              <div className='space-y-1 text-neutral-500 dark:text-gray-200 mb-4'>
                <p className="text-sm">
                  Connect with Us
                </p>
                <p className="text-sm">
                  2-M-29, Talwandi, Kota, Rajasthan
                </p>
                <p className="text-sm">
                  India - 324005
                </p>
              </div>

              {/* Address : 
E mail : support@skilltest.co.in
Whatsapp : +91- 9414886929 */}

              <Link
                // mailto href
                href="mailto:support@skilltest.co.in"
                className="text-sm transition-colors underline"
                target="_blank"
              >
                support@skilltest.co.in
              </Link>

              <p className='text-sm mt-1'>
                Whatsapp
              </p>
              <p className='text-sm'>
                +91-9414886929
              </p>
            </div>

            {/* <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Business District, Tech City</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <Link href="mailto:support@xaphra.com" className="hover:text-gray-900">
                  support@xaphra.com
                </Link>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Helpline - 1800-123-4567</span>
              </div>
            </div> */}
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-500 dark:text-gray-200">
              <li>
                <Link href="/about" className="text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="text-sm">
                  Acceptable Use Policy
                </Link>
              </li>
              {/* <li>
                <Link href="/disclaimer" className="text-sm">
                  Disclaimer
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer