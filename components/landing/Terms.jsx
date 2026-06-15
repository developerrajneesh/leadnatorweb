"use client";

import LegalDocument, { LegalLink, LegalSection } from "./LegalDocument";

export default function Terms({ onGoto }) {
  return (
    <LegalDocument
      onGoto={onGoto}
      currentPath="/terms"
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Leadnator."
      lastUpdated="June 13, 2026"
      seo={{
        title: "Terms & Conditions — Leadnator",
        description:
          "Leadnator Terms & Conditions: subscription rules, acceptable use, WhatsApp API obligations, liability and governing law for our CRM platform.",
        canonical: "https://leadnator.com/terms",
        keywords: "Leadnator terms of service, WhatsApp CRM terms, SaaS agreement India",
      }}
    >
      <LegalSection title="1. Agreement" defaultOpen>
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of
          Leadnator&apos;s website, applications and services (collectively, the
          &quot;Service&quot;). By creating an account or using the Service, you agree to
          these Terms and our Privacy Policy.
        </p>
        <p>
          If you use Leadnator on behalf of a company, you represent that you have
          authority to bind that entity to these Terms.
        </p>
      </LegalSection>

      <LegalSection title="2. The Service">
        <p>
          Leadnator provides a cloud-based platform for WhatsApp Business API messaging,
          Meta Ads management, email marketing, CRM, AI tools, file storage and related
          integrations. Features vary by subscription plan.
        </p>
        <p>
          We may modify, suspend or discontinue features with reasonable notice where
          practicable. We strive for high availability but do not guarantee uninterrupted
          access.
        </p>
      </LegalSection>

      <LegalSection title="3. Account & eligibility">
        <ul>
          <li>You must be at least 18 years old and legally able to enter a contract.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You must provide accurate registration and billing information.</li>
          <li>One person or legal entity may not maintain multiple free-tier accounts to circumvent limits.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Subscriptions & billing">
        <p>
          Paid plans are billed in advance on a monthly, quarterly or yearly cycle as
          selected at checkout. Prices are listed in INR unless otherwise stated; Indian
          customers may be charged 18% GST.
        </p>
        <p>
          WhatsApp conversation charges and certain third-party fees (Meta ads spend,
          SMS, etc.) are billed separately according to usage. Failure to pay may result
          in suspension or termination of access.
        </p>
        <p>
          For refund and cancellation rules, see our{" "}
          <LegalLink href="/refund-policy">Refund &amp; Cancellation Policy</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>You agree not to use Leadnator to:</p>
        <ul>
          <li>Send spam, unsolicited messages or violate WhatsApp/Meta commerce and messaging policies.</li>
          <li>Harass, defame, distribute malware or engage in illegal activity.</li>
          <li>Upload content that infringes intellectual property or privacy rights.</li>
          <li>Attempt to reverse engineer, scrape or overload the Service.</li>
          <li>Resell or sublicense the Service without written authorization.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules or applicable
          third-party platform policies.
        </p>
      </LegalSection>

      <LegalSection title="6. Your content & data">
        <p>
          You retain ownership of content and customer data you upload. You grant
          Leadnator a limited licence to host, process and transmit that data solely to
          provide the Service.
        </p>
        <p>
          You are responsible for obtaining consents required under applicable law
          (including opt-in for marketing messages) and for the accuracy of data you
          import or sync from Meta, WhatsApp or other sources.
        </p>
      </LegalSection>

      <LegalSection title="7. Third-party services">
        <p>
          Integrations with Meta, WhatsApp, payment gateways, email providers and other
          third parties are subject to their respective terms. Leadnator is not
          responsible for third-party outages, policy changes or fees.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual property">
        <p>
          Leadnator and its logos, software, documentation and design are owned by
          Leadnator or its licensors. These Terms do not grant you any rights to our
          trademarks or proprietary materials except as needed to use the Service.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimer & limitation of liability">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
          ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY OR FITNESS FOR A
          PARTICULAR PURPOSE.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEADNATOR SHALL NOT BE LIABLE FOR
          INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES, OR LOST PROFITS OR
          DATA. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE
          SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO LEADNATOR IN THE TWELVE (12)
          MONTHS PRECEDING THE CLAIM.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          You may cancel your subscription at any time from account settings or by
          contacting support. We may terminate or suspend access for breach of these
          Terms, non-payment or legal requirement.
        </p>
        <p>
          Upon termination, your right to use the Service ceases. We may delete account
          data after a reasonable retention period unless law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law & disputes">
        <p>
          These Terms are governed by the laws of India. Courts in India shall have
          exclusive jurisdiction, subject to mandatory consumer protection laws in your
          jurisdiction where applicable.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:legal@leadnator.com">legal@leadnator.com</a> or{" "}
          <LegalLink href="/contact">Contact Us</LegalLink>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
