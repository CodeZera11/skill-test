"use client"

import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="space-y-4">
            <div>
              <Link href="/" className="">
                <Image src="/logo.png" alt='main-logo' className='object-fill -ml-4' width={75} height={75} />
              </Link>
              <p className="text-sm font-bold mb-4">
                Skilltest Educations
              </p>
              <div className='space-y-1 text-neutral-500 dark:text-gray-200 mb-4'>
                <p className="text-sm">
                  Contact Us
                </p>
                <p className="text-sm">
                  Kota, Rajasthan
                </p>
                <p className="text-sm">
                  India - 324005
                </p>
              </div>

              <Link
                // mailto href
                href="mailto:support@skilltest.in"
                className="text-sm transition-colors underline"
                target="_blank"
              >
                support@skilltest.in
              </Link>

              <p className='text-sm mt-1'>
                Helpline
              </p>
              <p className='text-sm'>
                9000012345
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