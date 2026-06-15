"use client";

import LegalDocument, { LegalLink, LegalSection } from "./LegalDocument";

export default function RefundPolicy({ onGoto }) {
  return (
    <LegalDocument
      onGoto={onGoto}
      currentPath="/refund-policy"
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      subtitle="Clear rules for cancelling your plan and requesting refunds."
      lastUpdated="June 13, 2026"
      seo={{
        title: "Refund & Cancellation Policy — Leadnator",
        description:
          "Leadnator refund and cancellation policy: monthly plan cancellation, yearly pro-rata refunds within 14 days, WhatsApp wallet credits and billing disputes.",
        canonical: "https://leadnator.com/refund-policy",
        keywords: "Leadnator refund policy, CRM cancellation, WhatsApp CRM refund India",
      }}
    >
      <LegalSection title="1. Overview" defaultOpen>
        <p>
          We want you to be satisfied with Leadnator. This policy explains how
          cancellations and refunds work for subscription plans, add-ons and usage-based
          charges purchased through leadnator.com.
        </p>
      </LegalSection>

      <LegalSection title="2. Free trial">
        <p>
          New accounts may start on a free trial or free tier without payment. No refund
          applies because no charge is made. When you upgrade to a paid plan, billing
          begins according to the plan you select.
        </p>
      </LegalSection>

      <LegalSection title="3. Monthly plans — cancellation">
        <p>
          Monthly subscriptions can be cancelled at any time from your account billing
          settings or by contacting{" "}
          <LegalLink href="/contact">support</LegalLink>. Cancellation takes effect at the end of the
          current billing period — you retain access until then.
        </p>
        <p>
          <strong>No partial refunds</strong> are issued for unused days on monthly plans
          once a billing cycle has started, except where required by law or at our
          sole discretion for billing errors.
        </p>
      </LegalSection>

      <LegalSection title="4. Quarterly & yearly plans — refunds">
        <p>
          Quarterly and yearly plans are billed upfront for the full period. If you
          cancel within <strong>14 days</strong> of the initial purchase or renewal, you
          may request a <strong>pro-rata refund</strong> for the unused portion of the
          subscription term.
        </p>
        <p>
          Refund requests after 14 days are generally not eligible unless required by
          applicable consumer protection law or in cases of duplicate charges or verified
          service failure on our side.
        </p>
      </LegalSection>

      <LegalSection title="5. WhatsApp conversation wallet & usage charges">
        <p>
          Prepaid WhatsApp conversation credits and pay-as-you-go usage (messages,
          templates, Meta ad spend processed through Leadnator) are{" "}
          <strong>non-refundable</strong> once consumed or allocated to your account
          wallet, except for verified billing errors or unused wallet balance upon
          permanent account closure (evaluated case by case).
        </p>
        <p>
          Third-party fees charged by Meta/WhatsApp are passed through at cost and follow
          Meta&apos;s billing rules.
        </p>
      </LegalSection>

      <LegalSection title="6. Add-ons & enterprise contracts">
        <p>
          Custom enterprise agreements, onboarding packages and one-time setup fees are
          governed by the contract signed with Leadnator. Refund terms in that contract
          take precedence over this policy where they differ.
        </p>
      </LegalSection>

      <LegalSection title="7. How to cancel or request a refund">
        <ol>
          <li>Sign in to Leadnator → Settings → Billing → Cancel plan, or</li>
          <li>Email <a href="mailto:billing@leadnator.com">billing@leadnator.com</a> with your registered email and invoice ID, or</li>
          <li>Message us on WhatsApp at +91 7888341096.</li>
        </ol>
        <p>
          Refund requests are processed within <strong>7–10 business days</strong> to the
          original payment method. Bank processing times may vary.
        </p>
      </LegalSection>

      <LegalSection title="8. Chargebacks">
        <p>
          Please contact us before initiating a chargeback so we can resolve the issue
          quickly. Unwarranted chargebacks may result in account suspension.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes">
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the
          top reflects the current version. Continued use after changes constitutes
          acceptance.
        </p>
        <p>
          Questions? Visit <LegalLink href="/contact">Contact Us</LegalLink> or email{" "}
          <a href="mailto:billing@leadnator.com">billing@leadnator.com</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
