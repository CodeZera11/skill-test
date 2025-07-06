export default function TermsPage() {
  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {`The Skilltest website ("Website") and related services (together with the Website, the "Service") are
            operated by Skilltest Edu Solutions Pvt. Ltd. ("Skilltest", "us" or "we"). Access and use of the Service is
            subject to the following Terms and Conditions of Service.`}
          </p>
        </div>

        {/* General Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">General</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            By accessing or using any part of the Service, you represent that you have read, understood, and agree to be
            bound by these Terms and Conditions including any future modifications. Skilltest may amend, update or
            change these Terms and Conditions. If we do this, we will post a notice that we have made changes to these
            Terms and Conditions on the Website for at least 7 days after the changes are posted and will indicate at
            the bottom of the Terms and Conditions the date these terms were last revised.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Any revisions to these Terms and Conditions will become effective the earlier of (i) the end of such 7-day
            period or (ii) the first time you access or use the Service after such changes. If you do not agree to abide
            by these Terms and Conditions, you are not authorized to use, access or participate in the Service.
          </p>
        </section>

        {/* Description of Service */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Description of Website and Service
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Service allows users to prepare for any examination online by offering:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4 mb-4">
            <li>• Test Series e-module</li>
            <li>• Test Series e-module printed version</li>
            <li>• Evaluation services as opted/selected by Users</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Users interested in learning or practicing are presented with different types of educational activities.
            Skilltest may, in its sole discretion and at any time, update, change, suspend, make improvements to or
            discontinue any aspect of the Service, temporarily or permanently.
          </p>
        </section>

        {/* Registration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Registration</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            In connection with registering for and using the Service, you agree to:
          </p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>
              • Provide accurate, current and complete information about you and/or your organization as requested by
              Skilltest
            </li>
            <li>
              • Maintain the confidentiality of your password and other information related to the security of your
              account
            </li>
            <li>
              {`• Maintain and promptly update any registration information you provide to Skilltest while registering or
              during your usage of Skilltest's services, to keep such information accurate, current and complete`}
            </li>
            <li>
              • Be fully responsible for all use of your account and for any actions that take place through your
              account
            </li>
            <li>
              • By signing up on Skilltest you deemed to have given your consent to be contacted by us via phone calls
              and/or SMS notifications and offer you our services, imparting product knowledge, offer promotional,
              offers running on website/app, offers offered by the associated third parties and also
              order/shipment/delivery related updates, irrespective of the fact if also you have registered yourself
              under DND or DNC or NCPR service, you still authorize Skilltest to give you a call for the above mentioned
              purposes
            </li>
            <li>
              • You are required to provide your examination registration information for the purpose of our internal
              estimation of successful candidates. If you do not provide the information, your partial or full access to
              the website content and/or other Skilltest services may be blocked. No refund will be provided in such
              scenario. We assure you that we will not use this information for any other purpose or share this
              information with any third party
            </li>
          </ul>
        </section>

        {/* Subscriptions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Subscriptions</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            You may choose to purchase a monthly or annual subscription and download the Application through a third
            party platform. Alternatively, you may subscribe to our Services through our website and then download the
            related Application through a third party platform.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            When you purchase a subscription, payment may be processed by third parties who act on our behalf or
            directly by the third party platform (e.g. Apple or Google). Rates for services are listed in the
            Application and in the applicable app store. Skilltest reserves the right to modify its rates at any time
            and/or to offer special promotions. All payments are non-refundable.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Free Trial</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may provide a free trial period during which you can use all features of the Services for a limited
                period of time. You acknowledge and agree that your free-trial subscription will automatically renew as
                a paid subscription unless you cancel before the end of the trial period in accordance with the
                Cancellation section of the Terms of Service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Automatic Renewal</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Paid subscriptions to our Services are auto-renewing. You will be charged the stated subscription amount
                for the subscription period upon completion of your registration and submission of your payment
                information or, if applicable, at the end of your free trial period if you have not canceled at least 24
                hours in advance of the expiration of the trial period. Your subscription, and monthly billing of your
                account, will continue indefinitely until cancelled by you in accordance with the Cancellation section
                of the Terms of Service.
              </p>
            </div>
          </div>
        </section>

        {/* Your Representations and Warranties */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Your Representations and Warranties
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You represent and warrant to Skilltest that your access and use of the Service will be in accordance with
            these Terms and Conditions and with all applicable laws, rules and regulations of Constitution of India and
            any other relevant jurisdiction, including those regarding online conduct or acceptable content, and those
            regarding the transmission of data or information exported from India and/or the jurisdiction in which you
            reside. You further represent and warrant that you have created or own any material you submit to Skilltest
            and that you have the right to grant us a license to use that material.
          </p>
        </section>

        {/* Inappropriate Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Inappropriate Use</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            You will not upload, display or otherwise provide on or through the Service any content that:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              • Is libelous, defamatory, abusive, threatening, harassing, hateful, offensive or otherwise violates any
              law or infringes upon the right of any third party (including copyright, trademark, privacy, publicity or
              other personal or proprietary rights)
            </li>
            <li>
              {` `}
            </li>
          </ul>
        </section>

        {/* Indemnification */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Indemnification of Skilltest</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`You agree to defend, indemnify and hold harmless Skilltest and its directors, officers, employees,
            contractors, agents, suppliers, licensors, successors and assigns, from and against any and all losses,
            claims, causes of action, obligations, liabilities and damages whatsoever, including attorneys' fees,
            arising out of or relating to your access or use of the Service, any false representation made to us (as
            part of these Terms and Conditions or otherwise), your breach of any of these Terms and Conditions, or any
            claim that any service we provide to you is inaccurate, inappropriate or defective in any way whatsoever.`}
          </p>
        </section>

        {/* No Representations or Warranties */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            No Representations or Warranties
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`The service, including all images, audio files and other content therein, and any other information,
            property and rights granted or provided to you by Skilltest are provided to you on an "as is" basis.
            Skilltest and its suppliers make no representations or warranties of any kind with respect to the service,
            either express or implied, and all such representations and warranties, including warranties of
            merchantability, fitness for a particular purpose or non-infringement, are expressly disclaimed. Without
            limiting the generality of the foregoing, Skilltest does not make any representation or warranty of any kind
            relating to accuracy, service availability, completeness, informational content, error-free operation,
            results to be obtained from use, or non-infringement.`}
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            In no event will Skilltest be liable to you or any third party claiming through you (whether based in
            contract, tort, strict liability or other theory) for indirect, incidental, special, consequential or
            exemplary damages arising out of or relating to the access or use of, or the inability to access or use, the
            service or any portion thereof, including but not limited to the loss of use of the service, inaccurate
            results, loss of profits, business interruption, or damages stemming from loss or corruption of data or data
            being rendered inaccurate, the cost of recovering any data, the cost of substitute services or claims by
            third parties for any damage to computers, software, modems, telephones or other property, even if Skilltest
            has been advised of the possibility of such damages.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`Skilltest's liability to you or any third party claiming through you for any cause whatsoever, and
            regardless of the form of the action, is limited to the amount paid, if any, by you to Skilltest for the
            service in the 12 months prior to the initial action giving rise to liability. This is an aggregate limit.
            The existence of more than one claim hereunder will not increase this limit.`}
          </p>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Termination</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`Skilltest may terminate your access and use of the Service immediately at any time, for any reason, and at
            such time you will have no further right to use the Service. You may terminate your Skilltest account at any
            time by following the instructions available through the Service. The provisions of these Terms and
            Conditions relating to the protection and enforcement of Skilltest's proprietary rights, your
            representations and warranties, disclaimer of representations and warranties, release and indemnities,
            limitations of liability and types of damages, ownership of data and information, governing law and venue,
            and miscellaneous provisions shall survive any such termination.`}
          </p>
        </section>

        {/* Proprietary Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Proprietary Rights in Service Content
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {`All content available through the Service, including designs, text, graphics, images, information, software,
            audio, e-books, and other files, and their selection and arrangement (the "Service Content") along with
            printed version of e-books, are the proprietary property of Skilltest or its licensors. No Service Content
            along with printed version of e-books may be modified, copied, distributed, framed, reproduced, republished,
            downloaded, scraped, displayed, posted, transmitted, or sold in any form or by any means, in whole or in
            part, other than as expressly permitted in these Terms and Conditions.`}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`As between you and Skilltest, all data and information generated from your access and use of the educational
            activities made available on or through the Service, including translated content generated by you
            (collectively, the "Activity Data"), shall be exclusively owned by Skilltest, and you shall not have any
            right to use such Activity Data except as expressly authorized by these Terms and Conditions.`}
          </p>
        </section>

        {/* Trademarks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Trademarks</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`"Skilltest" and all other trademarks, service marks, graphics and logos used in connection with the Service
            are trademarks or service marks of Skilltest or their respective owners. Access and use of the Service does
            not grant or provide you with the right or license to reproduce or otherwise use the Skilltest name or any
            Skilltest or third-party trademarks, service marks, graphics or logos.`}
          </p>
        </section>

        {/* Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Use of the Service is also governed by our Privacy Policy, a copy of which is located at
            http://www.skilltest.com/privacy. By using the Service, you consent to the terms of the Privacy Policy.
          </p>
        </section>

        {/* Cancellation Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Cancellation Policy</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>
              • Cancellations will be considered only if the cancellation request is made within 24 hours of placing the
              order. However, the cancellation request will not be entertained if the orders have already been completed
              or if we have initiated the process of shipping either by ourselves or through the vendors/merchants/
              representatives whom we may appoint from time to time
            </li>
            <li>
              • No cancellations are allowed for products on which Skilltest marketing team has given special offers for
              various purposes including but not limited to special occasions like New Year, festivals, specific
              examination etc. These are limited validity offers and therefore cancellations are not possible
            </li>
            <li>
              • In case you feel that the product received is not as shown on the site and/or as per your expectations,
              you must bring it to the notice of our customer service within 24 hours of receiving the product. The
              customer service team, after looking into your complaint, will make an appropriate decision
            </li>
          </ul>
        </section>

        {/* Refund Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Refund Policy</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>
              {`• The refund is applicable for our products/services only until it's dispatched or the login details for
              online access to test material etc. are disclosed/dispatched to you`}
            </li>
            <li>
              {`• Please include your order number (sent to you via email after your order) and do tell us why you're
              requesting a refund. We take customer feedback very seriously and use it to constantly improve our
              products and quality of service`}
            </li>
            <li>
              • All refunds, if eligible, will be processed within 14 (Fourteen) business days of receiving cancellation
              request and mode of refund would be same through which the original transaction was done
            </li>
          </ul>
        </section>

        {/* Copyright Notice */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Notice for Claims of Copyright Violations
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If you are a copyright owner and have a good faith belief that any material available through the service
            infringes upon your copyrights, you may submit a copyright infringement notification to Skilltest pursuant
            to the Digital Millennium Copyright Act by providing us with the following information in writing:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-4">
            <li>
              • An electronic or physical signature of the copyright owner or the person authorized to act on behalf of
              the owner
            </li>
            <li>• A description of the copyrighted work that you claim has been infringed</li>
            <li>• A description of where the material that you claim is infringing is located on the Service</li>
            <li>• Your address, telephone number, and email address</li>
            <li>• A statement by you that you have a good faith belief that the disputed use is not authorized</li>
            <li>
              • A statement by you, made under penalty of perjury, that the above information in your notice is accurate
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`Skilltest's Agent for Notice of claims of copyright infringement can be reached at: support@skilltest.in`}
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Governing Law and Arbitration</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`These Terms and Conditions, its subject matter and Skilltest's and your respective rights under these Terms
            and Conditions shall be governed by the laws of India and you agree that the courts of Mumbai will have
            exclusive jurisdiction over any dispute (contractual or non-contractual) concerning these terms.`}
          </p>
        </section>

        {/* Miscellaneous */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Miscellaneous</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {`These Terms and Conditions constitute the entire agreement between Skilltest and you concerning the subject
            matter hereof. In the event that any of the Terms and Conditions are held by a court or other tribunal of
            competent jurisdiction to be unenforceable, such provisions shall be limited or eliminated to the minimum
            extent necessary so that these Terms and Conditions shall otherwise remain in full force and effect. A
            waiver by Skilltest or you of any provision of these Terms and Conditions or any breach thereof, in any one
            instance, will not waive such term or condition or any subsequent breach thereof. Skilltest may assign its
            rights or obligations under these Terms and Conditions without condition. These Terms and Conditions will be
            binding upon and will inure to the benefit of Skilltest and you, and Skilltest's and your respective
            successors and permitted assigns.`}
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">
              For questions about these Terms and Conditions, please contact our support team at support@skilltest.in
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
