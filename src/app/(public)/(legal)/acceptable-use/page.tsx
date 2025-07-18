export default function AcceptableUsePolicyPage() {
  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Acceptable Use Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Skilltest provides a platform to prepare for exams online. To keep Skilltest running smoothly for all of our
            Users, you agree that you will use the Service only in a manner consistent with the following Acceptable Use
            Policy.
          </p>
        </div>

        {/* Prohibited Content Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Prohibited User Content</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to post User Content that:</p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>• Is sexually explicit or pornographic</li>
            <li>
              • Creates a risk of harm, loss, physical or mental injury, emotional distress, death, disability,
              disfigurement, or physical or mental illness to yourself, to any other person, or to any animal
            </li>
            <li>• May create a risk of any other loss or damage to any person or property</li>
            <li>
              • Seeks to harm or exploit children by exposing them to inappropriate content, asking for personally
              identifiable details or otherwise
            </li>
            <li>• Violates, or encourages any conduct that violates laws or regulations</li>
            <li>
              • Contains any information or content we deem to be hateful, violent, harmful, abusive, racially or
              ethnically offensive, defamatory, infringing, invasive of personal privacy or publicity rights, harassing,
              humiliating to other people (publicly or otherwise), libelous, threatening, profane, or otherwise
              objectionable
            </li>
            <li>
              {`• Contains any information or content that is illegal (including, without limitation, the disclosure of
              insider information under securities law or of another party's trade secrets)`}
            </li>
            <li>
              {`• Infringes any third party's Intellectual Property Rights, privacy rights, publicity rights, or other
              personal or proprietary rights`}
            </li>
            <li>
              • Contains any information or content that you do not have a right to make available under any law or
              under contractual or fiduciary relationships
            </li>
            <li>• Is fraudulent, false, misleading, or deceptive</li>
          </ul>
        </section>

        {/* Prohibited Activities Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Prohibited Activities</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            You agree not to engage in any of the following prohibited activities:
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Unauthorized Use & Access</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  • Use, display, mirror or frame the Service, any individual element within the Service, the Skilltest
                  name, trademark, logo or other proprietary information, or the layout and design of any page, without
                  our express written consent
                </li>
                <li>
                  • Access, tamper with, or use non-public areas of the Service, our computer systems, or the technical
                  delivery systems of our providers
                </li>
                <li>
                  • Attempt to probe, scan, or test the vulnerability of any Skilltest system or network or breach any
                  security or authentication measures
                </li>
                <li>
                  • Avoid, bypass, remove, deactivate, impair, descramble or otherwise circumvent any technological
                  measure implemented by Skilltest or any of our providers or any other third party (including another
                  user) to protect the Services or Skilltest Content
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Automated Access & Content Manipulation
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  • Attempt to access or search the Services, User Content or Skilltest Content or scrape or download
                  User Content or Skilltest Content from the Services, or otherwise use, upload content to, or create
                  new links, re-posts, or referrals in the Service through the use of any engine, software, tool, agent,
                  device or mechanism (including automated scripts, spiders, robots, crawlers, data mining tools or the
                  like) other than the software and/or search agents provided by Skilltest or other generally available
                  third party web browsers
                </li>
                <li>
                  {`• Use any meta tags or other hidden text or metadata utilizing a Skilltest or Skilltest trademark,
                  logo, URL, or product name without Skilltest's express written consent`}
                </li>
                <li>
                  • Attempt to decipher, decompile, disassemble or reverse engineer any of the software used to provide
                  the Services
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Spam & Solicitation</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  • Send any unsolicited or unauthorized spam and spam comments on posts, advertising messages,
                  promotional materials, email, junk mail, chain letters or other form of solicitation
                </li>
                <li>
                  • Use Skilltest user information to forge any TCP/IP packet header or any part of the header
                  information in any email or newsgroup posting, or in any way use the Services to send altered,
                  deceptive or false source-identifying information
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">System Interference & Misuse</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  • Interfere with, or attempt to interfere with, the access of any user, host or network, including,
                  without limitation, sending a virus, overloading, flooding, spamming, or mail-bombing the Services
                </li>
                <li>
                  • Collect or store any personally identifiable information from the Services from other users of the
                  Services without their express permission
                </li>
                <li>
                  • Use the Service for any commercial purpose or the benefit of any third party, except as otherwise
                  explicitly permitted for you by Skilltest or in any manner not permitted by the Terms
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Account & Identity Violations</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>• Impersonate or misrepresent your affiliation with any person or entity</li>
                <li>
                  • Request, collect or store username, password, token or any other account authentication information
                  from other users
                </li>
                <li>
                  • Share your account credentials with your friend/relative or anyone else in order to study from a
                  common account
                </li>
                <li>
                  • Encourage or enable any other individual to do any of the activities prohibited in this Acceptable
                  Use Policy
                </li>
                <li>• Violate any applicable law or regulation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Enforcement Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Enforcement</h2>
          <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {`Skilltest reserves the right, but is not obligated, to remove any User Content for any reason or for no
              reason, including User Content that Skilltest believes violates this Acceptable Use Policy or its Terms of
              Service. Skilltest may also permanently or temporarily terminate or suspend a User account without notice
              and liability for any reason, including if, in Skilltest's sole determination, a User violates any
              provision of this Acceptable Use Policy, our Terms of Service, or for no reason.`}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">For questions about this Acceptable Use Policy, please contact our support team.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
