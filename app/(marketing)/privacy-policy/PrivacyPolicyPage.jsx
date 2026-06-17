"use client";

import LegalDocument, { LegalLink, LegalSection } from "@/components/site/LegalDocument";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How Leadnator collects, uses and protects your data."
      lastUpdated="June 13, 2026"
    >
      <LegalSection title="1. Introduction" defaultOpen>
        <p>
          Leadnator (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Leadnator platform at
          leadnator.com and related applications. This Privacy Policy explains how we
          collect, use, disclose and safeguard information when you use our services.
        </p>
        <p>
          By using Leadnator, you agree to the collection and use of information in
          accordance with this policy. If you do not agree, please do not use our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p><strong>Account information:</strong> name, email, phone number, company name, billing address and payment details when you register or subscribe.</p>
        <p><strong>Usage data:</strong> log files, IP address, browser type, pages visited, features used and timestamps to improve the platform and prevent abuse.</p>
        <p><strong>Customer data you upload:</strong> leads, contacts, WhatsApp messages, email lists, campaign content, files and CRM records that you or your team store in Leadnator on behalf of your business.</p>
        <p><strong>Integration data:</strong> tokens and metadata from connected services such as Meta (Facebook/Instagram), WhatsApp Business API, email SMTP providers, payment gateways and webhooks.</p>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <ul>
          <li>Provide, operate and maintain the Leadnator platform and integrations.</li>
          <li>Process subscriptions, invoices and payment transactions.</li>
          <li>Send service-related communications, security alerts and product updates.</li>
          <li>Provide customer support via email, phone and WhatsApp.</li>
          <li>Analyse usage to improve features, performance and reliability.</li>
          <li>Detect, prevent and address fraud, abuse or technical issues.</li>
          <li>Comply with legal obligations and enforce our Terms &amp; Conditions.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </LegalSection>

      <LegalSection title="4. WhatsApp & Meta data">
        <p>
          When you connect WhatsApp Business API or Meta Ads, we process data according
          to Meta&apos;s Platform Terms and WhatsApp Business Policy. You are the data
          controller for your end-customers&apos; contact and message data; Leadnator acts
          as a data processor on your instructions.
        </p>
        <p>
          Message content and contact records are stored securely and used only to
          deliver the features you enable (broadcasts, chatbots, CRM sync, analytics).
        </p>
      </LegalSection>

      <LegalSection title="5. Data sharing">
        <p>We may share information with:</p>
        <ul>
          <li><strong>Service providers:</strong> cloud hosting, payment processors, email delivery and analytics — bound by confidentiality agreements.</li>
          <li><strong>Integration partners:</strong> Meta, WhatsApp and other platforms you explicitly connect.</li>
          <li><strong>Legal requirements:</strong> when required by law, court order or to protect rights and safety.</li>
          <li><strong>Business transfers:</strong> in connection with a merger, acquisition or sale of assets, with notice where required.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data retention & security">
        <p>
          We retain account and customer data for as long as your subscription is active
          or as needed to provide services. You may request deletion of your account data
          subject to legal retention requirements.
        </p>
        <p>
          We implement industry-standard security measures including encryption in transit
          (TLS), access controls and regular infrastructure reviews. No method of
          transmission over the Internet is 100% secure; we strive to protect your data
          but cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access, correct or delete personal data we hold about you.</li>
          <li>Export your data in a portable format.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Withdraw consent where processing is consent-based.</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:privacy@leadnator.com">privacy@leadnator.com</a> or via{" "}
          <LegalLink href="/contact">Contact Us</LegalLink>. We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          We use essential cookies for authentication and session management, and
          optional analytics cookies to understand product usage. You can control
          non-essential cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          Leadnator is a business platform not intended for individuals under 18. We do
          not knowingly collect data from children.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes & contact">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be
          posted on this page with an updated &quot;Last updated&quot; date.
        </p>
        <p>
          Questions? Email{" "}
          <a href="mailto:privacy@leadnator.com">privacy@leadnator.com</a> or visit our{" "}
          <LegalLink href="/contact">Contact Us</LegalLink> page. WhatsApp: +91 7888341096.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
