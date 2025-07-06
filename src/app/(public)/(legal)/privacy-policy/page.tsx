export default function PrivacyPage() {
  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            By using, accessing or participating in the Service, you agree to the terms of this Privacy Policy.
            Capitalized terms not defined in this Privacy Policy have the meanings set forth in the Terms and
            Conditions. We reserve the right to change our Privacy Policy at any time.
          </p>
        </div>

        {/* General */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">General</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If we make changes to this Privacy Policy, we will post a notice that we have made changes to this Privacy
            Policy on the Website for at least 7 days after the changes are posted and will indicate at the bottom of
            the Privacy Policy the date these terms were last revised. Any revisions to this Privacy Policy will become
            effective the earlier of (i) the end of the foregoing 7-day period or (ii) the first time you access or use
            the Service after any such changes.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you do not agree to abide by this Privacy Policy, you are not authorized to use, access or participate in
            the Service.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Information We Collect</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Account Information</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Skilltest Application uploads your Phone Number on its API servers to https://api.skilltest.com to help
                map your account and mobile number.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                When you use the Service you provide us with two types of information: (i) information you submit via
                the Service and (ii) information regarding your use of the Service collected by us as you interact with
                the Service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Browser and Device Information</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {`When you enter the Website, we collect your browser type and IP address. This information is gathered
                for all Website visitors. In addition, we store certain information from your browser using "cookies." A
                cookie is a piece of data stored on the user's computer tied to information about the user.`}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use session ID cookies to confirm that users are logged in. If you do not want information collected
                through the use of cookies, there is a simple procedure in most browsers that allows you to deny or
                accept the cookie feature; however, you should note that cookies may be necessary to provide you certain
                features (e.g., customized delivery of information) available on the Website.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Registration Information</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Through the registration process you may provide us with your name, mobile number, email address,
                hometown, and other information that may be requested during the registration process. When you use the
                Service you may submit information and content to your profile, generate Activity Data through engaging
                in educational activities on the Service, or send messages and otherwise transmit information to other
                users. We store this information so that we can provide you the Service and offer personalized features.
              </p>
            </div>
          </div>
        </section>

        {/* Use of Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Use of Information Obtained by Skilltest
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may use your contact information to send you notifications regarding new services offered by Skilltest
              and its partners that we think you may find valuable. Skilltest may also send you service-related
              announcements from time to time through the general operation of the Service. Generally, you may opt out
              of such emails, although Skilltest reserves the right to send you notices about your account even if you
              opt out of all voluntary email notifications.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Profile information is used by Skilltest primarily to be presented back to and edited by you when you
              access the Service and to be presented to other users. In some cases, other users may be able to
              supplement your profile, including by submitting comments.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Skilltest may use aggregate or anonymous data collected through the Service, including Activity Data, for
              any purpose. This data may be used by Skilltest and shared with third parties in any manner.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Data Deletion:</strong> Users can request deletion of their data by sending an email to
                support@skilltest.com
              </p>
            </div>
          </div>
        </section>

        {/* Sharing Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Sharing Your Personally-Identifiable Information with Third Parties
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Skilltest shares your personally-identifiable information only in limited circumstances where Skilltest
            believes such sharing is reasonably necessary to offer the Service, legally required or, permitted by you.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Service Providers</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may provide personally-identifiable information to service providers who help us bring you the
                Service, such as hosting the Service at a co-location facility or sending email updates. In connection
                with these operations, our service providers may have access to personally-identifiable information for
                use for a limited time. Where we utilize service providers for the processing of any of
                personally-identifiable information, we implement reasonable contractual protections limiting the use of
                that personally-identifiable information to the provision of services to Skilltest.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Mobile SDKs and Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {`Notwithstanding anything else in this policy, we may work with partners who use mobile SDKs, including
                the OneSignal Messaging SDK, to passively collect information (collectively, "SDK Information"), which
                generally helps us deliver personalized notifications. This data may also be used to identify you in a
                unique manner across other devices or browsers for the purposes of customizing ads or content. Depending
                on the permissions granted to this application, this information may include personally identifiable
                information (PII) including your e-mail address. This information may also include precise location
                (i.e. GPS-level data) or WiFi information, apps you have installed and enabled, and your mobile
                identifier (e.g., Android Advertising ID).`}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Legal Requirements</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may be required to disclose personally-identifiable information pursuant to lawful requests, such as
                subpoenas or court orders, or in compliance with applicable laws. Additionally, we may share account or
                other personally-identifiable information when we believe it is necessary to comply with law, to protect
                our interests or property, to prevent fraud or other illegal activity perpetrated through the Service or
                using the Skilltest name, or to prevent imminent harm.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Business Transfers</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If the ownership of all or substantially all of the Skilltest business, or individual business units or
                assets owned by Skilltest that are related to the Service, were to change, your personally-identifiable
                information may be transferred to the new owner. In any such transfer of information, your
                personally-identifiable information would remain subject to this section.
              </p>
            </div>
          </div>
        </section>

        {/* Consumer Control */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Consumer Control & Opt-Out Options
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Push Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong>Opting-out of OneSignal Push Notifications:</strong> {`You may in most cases opt out of receiving
                push notifications by going to your device "Settings" and clicking on "Notifications," and then changing
                those settings for some or all of the apps on your device. (Different device configurations, or updates
                to devices, may affect or change how these settings work.)`}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Cross-App Advertising</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong>{`Opting Out of "Cross-App" Advertising on Mobile Devices:`}</strong> {`You can opt out of having your
                mobile advertising identifiers used for certain types of interest-based (also called "cross-app") mobile
                behavioral advertising, by accessing the "settings" on your Apple or Android mobile device, as follows:
                By opening the Google Settings app on your device, selecting Ads, and then selecting the option to
                opt-out of interest-based ads. (Different device configurations, or updates to devices, may affect or
                change how these settings work.)`}
              </p>
            </div>
          </div>
        </section>

        {/* Intercom Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Use of Intercom Services</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {`We use third-party analytics services to help understand your usage of our services. In particular, we
            provide a limited amount of your information (such as sign-up date and some personal information like your
            mobile number, email address) to Intercom, Inc. ("Intercom") and utilize Intercom to collect data for
            analytics purposes when you visit our website or use our product.`}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            As a data processor acting on our behalf, Intercom analyzes your use of our website and/or product and
            tracks our relationship by way of cookies and similar technologies so that we can improve our service to
            you.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`We may also use Intercom as a medium for communications, either through email, or through messages within
            our product(s). The Intercom Messenger Apps and Apps in Inbox products may also provide you with access to
            other third party applications such as Stripe. You should consult these third parties' privacy notices for
            further information on their use of your personal data. As part of our service agreements, Intercom collects
            publicly available contact and social information related to you, such as your mobile number, email address,
            gender, company, job title, photos, website URLs, social network handles and physical addresses, to enhance
            your user experience.`}
          </p>
        </section>

        {/* Links and Third Parties */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Links and Third-Party Services</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">External Links</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The Service may contain links to other websites. We are not responsible for the privacy practices of
                other websites. We encourage users to be aware when they leave the Service to read the privacy
                statements of other websites that collect personally identifiable information. This Privacy Policy
                applies solely to information collected by Skilltest via the Service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">YouTube Integration</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                We may also integrate with third parties who will interact with you under their terms of service. One
                such third party is YouTube and by using the Sites or Services, you agree to be bound by the YouTube
                Terms of Service and also by the privacy policies of Google.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use YouTube APIs to show you the video views count and Embed YouTube videos on Free Videos page.
              </p>
            </div>
          </div>
        </section>

        {/* Company Disclaimer */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Company Disclaimer</h2>
          <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We are an independent Ed-Tech Company involved in offering exam preparation services, wherein exam
              aspirants can prepare for various Union & State Government exams. However, we categorically state that we
              do not represent any Central/State Govt department or any other private organisations as such.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">
              For questions about this Privacy Policy, please contact our support team at support@skilltest.com
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
