import { motion } from "framer-motion";

const PALETTE = {
  bg: "#0B0B0C",
  ink: "#E9E6DD",
  lime: "#D6FF3F",
  coral: "#FF6B4A",
  mut: "#8B8C86",
  line: "rgba(233,230,221,0.14)",
  cardBg: "rgba(233,230,221,0.02)",
};

const PLANS = [
  {
    name: "PERSONAL",
    tagline: "For individuals who value seamless zero-knowledge privacy.",
    price: "$0",
    period: "forever",
    featured: false,
    cta: "GET STARTED FREE",
    ctaStyle: "secondary",
    features: [
      "Unlimited passwords & passkeys",
      "End-to-end zero-knowledge encryption",
      "Sync across 3 personal devices",
      "Basic auto-fill & generator",
    ],
  },
  {
    name: "PRO VAULT",
    tagline: "Complete security for power users, freelancers, & creators.",
    price: "$4",
    period: "per month, billed annually",
    featured: true,
    badge: "MOST POPULAR",
    cta: "START 14-DAY TRIAL",
    ctaStyle: "primary",
    features: [
      "Everything in Personal, plus:",
      "Unlimited device syncing",
      "Dark web breach monitoring",
      "1GB encrypted file storage",
      "Emergency access recovery",
      "24/7 priority support",
    ],
  },
  {
    name: "TEAMS & SECURITY",
    tagline: "Granular access management and policy enforcement for startups.",
    price: "$9",
    period: "per user / month",
    featured: false,
    cta: "TALK TO SALES",
    ctaStyle: "secondary",
    features: [
      "Everything in Pro, plus:",
      "Shared vaults & item permissioning",
      "SSO & SAML 2.0 integration",
      "Centralized admin audit logs",
      "Custom security policies",
      "Dedicated account manager",
    ],
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="border-t relative overflow-hidden py-20 sm:py-32"
      style={{ borderColor: PALETTE.line, backgroundColor: PALETTE.bg }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <p
            className="mono text-xs tracking-[0.22em] mb-4"
            style={{ color: PALETTE.mut }}
          >
            SEC. 04 / PRICING
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl leading-[1.04] tracking-tight mb-6"
            style={{ color: PALETTE.ink }}
          >
            Simple pricing.{" "}
            <span className="italic" style={{ color: PALETTE.lime }}>
              Zero hidden costs.
            </span>
          </motion.h2>
          <p className="text-sm sm:text-base" style={{ color: PALETTE.mut }}>
            Choose the level of defense your digital life demands. Upgrade or
            cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex flex-col justify-between p-8 sm:p-10 border rounded-sm transition-all"
              style={{
                borderColor: plan.featured ? PALETTE.lime : PALETTE.line,
                backgroundColor: PALETTE.cardBg,
              }}
            >
              {/* Highlight Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.2em] px-3 py-1 font-semibold"
                  style={{ background: PALETTE.lime, color: "#0B0B0C" }}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Plan Title & Tagline */}
                <h3
                  className="mono text-xs tracking-[0.2em] font-semibold mb-3"
                  style={{ color: plan.featured ? PALETTE.lime : PALETTE.ink }}
                >
                  {plan.name}
                </h3>
                <p className="text-xs min-h-[36px]" style={{ color: PALETTE.mut }}>
                  {plan.tagline}
                </p>

                {/* Pricing Number */}
                <div className="my-8 flex items-baseline gap-2">
                  <span
                    className="font-display text-5xl sm:text-6xl tracking-tight"
                    style={{ color: PALETTE.ink }}
                  >
                    {plan.price}
                  </span>
                  <span className="mono text-xs" style={{ color: PALETTE.mut }}>
                    / {plan.period}
                  </span>
                </div>

                <div
                  className="h-px w-full my-6"
                  style={{ backgroundColor: PALETTE.line }}
                />

                {/* Features List */}
                <ul className="space-y-4 mb-10 text-xs sm:text-sm">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-3"
                      style={{
                        color: fIdx === 0 && plan.featured ? PALETTE.ink : PALETTE.mut,
                      }}
                    >
                      <span
                        className="italic font-bold select-none"
                        style={{ color: PALETTE.lime }}
                      >
                        ·
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Button */}
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mono text-xs tracking-[0.2em] w-full py-4 text-center rounded-sm border transition-all block"
                style={
                  plan.ctaStyle === "primary"
                    ? {
                        background: PALETTE.lime,
                        color: "#0B0B0C",
                        borderColor: PALETTE.lime,
                      }
                    : {
                        borderColor: PALETTE.line,
                        color: PALETTE.ink,
                      }
                }
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;