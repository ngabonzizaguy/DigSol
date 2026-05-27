-- DigSolutions — seed content from existing static data
-- Idempotent — uses on conflict do nothing.

-- ============================================================================
-- Services
-- ============================================================================
insert into public.services (slug, title, short, long, outcomes, deliverables, capabilities, orb, status, sort_order) values
('digital-strategy', 'Digital strategy & consultation',
 'Maps for businesses that need clarity before they need code.',
 'We help leadership teams diagnose where they are, prioritise what to digitise, and build a transformation roadmap with sequencing, budgets, and measurable outcomes.',
 array['12–24 month transformation roadmap','Quantified ROI per initiative','Vendor and platform recommendations'],
 array['Discovery workshops','Maturity assessment','Roadmap deck','Executive briefing'],
 array['Digital maturity audit','Operating model design','Investment prioritisation'],
 'lavender','published',10),
('web-mobile','Website & mobile app development',
 'Editorial-grade marketing sites and production-grade mobile apps.',
 'From conversion-focused marketing sites to React Native customer apps, we ship fast, accessible, performant products with a design system that grows with you.',
 array['Launch-ready site in 4–8 weeks','Lighthouse 90+ scores','Native iOS + Android from one codebase'],
 array['Design system','Next.js or Expo build','CMS or headless backend','App Store launch'],
 array['Next.js','React Native (Expo)','Sanity / Contentful','Native integrations'],
 'mint','published',20),
('design-branding','Branding & UI/UX design',
 'Identity systems and product surfaces that feel inevitable.',
 'We build brand identities, design systems, and pixel-perfect product UI. Premium polish without the agency premium — and every asset is engineered for handoff.',
 array['Cohesive brand across touchpoints','Faster engineering handoff','Higher conversion on key journeys'],
 array['Logo + identity','Design tokens','Figma library','UX research'],
 array['Brand strategy','Visual identity','Design systems','Motion language'],
 'rose','published',30),
('automation-ai','Business automation & AI integration',
 'Quiet automation and tasteful AI — not chatbot theatre.',
 'We map your workflows, eliminate manual handoffs with n8n / Zapier / custom integrations, and embed AI agents where they create real leverage — sales ops, support, content, ops.',
 array['20–60% faster operations','AI-assisted support and sales','Cleaner data, fewer manual steps'],
 array['Workflow audit','Automation builds','AI agent / LLM integration','Monitoring'],
 array['n8n / Make / Zapier','OpenAI / Anthropic','Vercel AI SDK','Custom webhooks'],
 'sky','published',40),
('crm-sales','CRM systems',
 'A sales and service backbone that your team will actually use.',
 'We implement, customise, and integrate CRM platforms (HubSpot, Salesforce, Attio, Pipedrive) — and connect them to marketing, finance, and product data.',
 array['Single customer record','Pipeline visibility','Automated nurturing'],
 array['CRM build','Data migration','Pipeline automation','Team training'],
 array['HubSpot','Salesforce','Attio','Pipedrive'],
 'peach','published',50),
('commerce-payments','E-commerce & payment integration',
 'Storefronts, checkouts, and billing that just work — globally.',
 'Headless storefronts (Shopify, Medusa), subscription billing (Stripe), invoicing, and reconciliation. Designed for international currencies, taxes, and edge cases.',
 array['Higher checkout conversion','Lower payment ops overhead','Global currency + tax handling'],
 array['Shopify / Medusa build','Stripe billing','Invoicing','Webhook reconciliation'],
 array['Shopify Hydrogen','Stripe','Medusa','Adyen'],
 'mint','published',60),
('hosting-ops','Hosting, maintenance & cloud infrastructure',
 'Operations you don''t have to think about.',
 'We host, monitor, patch, and scale your apps on Vercel, AWS, or GCP — with infrastructure-as-code, SLAs, and 24/7 alerting baked in.',
 array['99.95% uptime targets','Predictable monthly ops cost','Hands-off scaling'],
 array['Vercel / AWS setup','IaC (Terraform/Pulumi)','Monitoring stack','Runbook'],
 array['Vercel','AWS','GCP','Cloudflare','Terraform'],
 'sky','published',70),
('analytics-growth','Analytics, marketing & SEO',
 'Numbers you trust, content that ranks, ads that pay back.',
 'We build analytics dashboards (PostHog, GA4, Looker), run SEO programs, manage paid acquisition (Google, LinkedIn, Meta), and tie it all to revenue.',
 array['Single source of truth for growth','Higher organic traffic','Predictable CAC'],
 array['Analytics implementation','SEO program','Paid acquisition','Content engine'],
 array['PostHog','GA4','Looker','Ahrefs','Google / LinkedIn Ads'],
 'lavender','published',80)
on conflict (slug) do nothing;

-- ============================================================================
-- Industries
-- ============================================================================
insert into public.industries (slug, name, short, challenges, solutions, status, sort_order) values
('healthcare','Healthcare',
 'Patient experience, clinical workflows, and HIPAA-aware platforms.',
 array['Fragmented patient records','Manual scheduling and intake','Compliance overhead'],
 array['Patient portals','Telehealth platforms','HIPAA-compliant data layers','Workflow automation'],
 'published',10),
('financial-services','Financial services',
 'Trust, compliance, and customer-grade UX for regulated finance.',
 array['Legacy core systems','Strict compliance','Customer experience gaps'],
 array['Customer portals','KYC / AML automation','Data platforms','Mobile banking apps'],
 'published',20),
('manufacturing','Manufacturing',
 'IoT, operations dashboards, and supply chain visibility.',
 array['Shop-floor data silos','Supplier coordination','Asset uptime'],
 array['IoT data pipelines','Real-time dashboards','Supplier portals','Predictive maintenance'],
 'published',30),
('retail-ecommerce','Retail & e-commerce',
 'Storefronts, omni-channel, and growth instrumentation.',
 array['Fragmented checkout','Inventory across channels','Conversion plateaus'],
 array['Headless commerce','Subscription billing','Loyalty programs','CRO programs'],
 'published',40),
('professional-services','Professional services',
 'Productising expertise — websites, portals, billing, automation.',
 array['Manual billing','Document chaos','Client onboarding'],
 array['Client portals','Document automation','CRM + billing','Marketing engine'],
 'published',50),
('public-sector','Public sector',
 'Accessible, secure, accountable digital services for citizens.',
 array['Procurement constraints','Accessibility mandates','Legacy migration'],
 array['Accessible portals','Secure cloud migration','Citizen service platforms','Open data dashboards'],
 'published',60)
on conflict (slug) do nothing;

-- ============================================================================
-- Case studies
-- ============================================================================
insert into public.case_studies (slug, client, title, segment, industry, summary, challenge, approach, outcome, metrics, service_slugs, orb, status, featured, sort_order) values
('greenride-africa-mobility','Greenride Africa','Rwanda''s electric ride platform — app, web, and ops shipped together','smb','Mobility & ride-hailing',
 'Greenride Africa, a fully electric mobility startup in Kigali, needed a passenger app, marketing website, and booking backbone before launching on city streets — without cloning legacy fuel-based taxi stacks.',
 'Riders expected reliable EV trips booked in seconds; operations still ran on spreadsheets and chat threads. The brand had to earn trust as a local, sustainable alternative — not a generic ride template. Leadership wanted mobile, web, and backend delivered by one accountable team ahead of a public launch.',
 'We designed and built the passenger mobile experience and responsive web presence, unified ride requests and trip status on Supabase + Vercel, and added an operations-friendly admin layer for bookings and fleet visibility. Notifications, payments, and analytics were wired for day-one service across Kigali — ride-hailing, VIP, corporate, and airport runs on one platform.',
 'Greenride launched with a 100% electric fleet on Kigali streets — clean, quiet rides built for local riders. Bookings flow through the app; corporate and VIP programs share the same core. The stack is ready to extend into delivery and charging as the network grows across Rwanda.',
 '[{"label":"Fleet","value":"100% electric"},{"label":"Services live","value":"Ride · VIP · Corp"},{"label":"Market","value":"Kigali, Rwanda"}]'::jsonb,
 array['web-mobile','digital-strategy','automation-ai'],
 'mint','published',true,10),
('enterprise-bank-data-platform','Meridian Financial Group','A regional bank''s data backbone, modernised without a freeze','enterprise','Financial services',
 'A 2,000-employee bank needed a unified customer data layer feeding 14 downstream systems without a service interruption.',
 'Customer data lived in 6 source systems. Compliance reporting took 3 weeks. Marketing personalisation was effectively impossible.',
 'We designed a domain-driven data platform on AWS with event streaming (Kinesis), a governed lakehouse, and identity resolution. Migration ran on shadow infrastructure for 4 months before cutover.',
 'Compliance reporting dropped from 21 days to 4 hours. Marketing personalisation drove a 23% uplift on key campaigns. Zero customer-facing downtime during cutover.',
 '[{"label":"Compliance reporting","value":"21d → 4h"},{"label":"Campaign uplift","value":"+23%"},{"label":"Customer downtime","value":"0 minutes"}]'::jsonb,
 array['digital-strategy','automation-ai','hosting-ops'],
 'sky','published',true,20),
('manufacturing-iot-operations','Forge & Field Manufacturing','Shop-floor IoT, finally connected to the boardroom','midmarket','Manufacturing',
 'A 450-person components manufacturer wanted real-time machine data on a single dashboard — without re-tooling.',
 'Machine data lived in PLCs from four vendors. Quality issues showed up days after they occurred. Ops leadership flew blind.',
 'We installed lightweight edge collectors, streamed events through a managed broker, and built a real-time ops dashboard with PostHog and a custom React layer. AI anomaly alerts flag drift within minutes.',
 'Defect rates dropped 34%. Mean time to detect a quality issue went from 3.1 days to 19 minutes. Maintenance shifted from reactive to predictive.',
 '[{"label":"Defect rate","value":"-34%"},{"label":"Time to detect","value":"3.1d → 19m"},{"label":"Unplanned downtime","value":"-41%"}]'::jsonb,
 array['automation-ai','analytics-growth','hosting-ops'],
 'mint','published',false,30),
('healthcare-patient-portal','Cedar Health Network','A patient portal that patients actually open','midmarket','Healthcare',
 'A 12-clinic network''s existing portal had 4% adoption. The new one hit 71% in 4 months.',
 'Patients ignored the portal. Front desks were buried in calls. Clinical staff still printed forms.',
 'We rebuilt the portal as a fast PWA, added SMS-based onboarding, redesigned intake to mobile-first, and integrated to the EHR via FHIR. Compliance was baked in from day one.',
 'Portal adoption hit 71%. Inbound call volume dropped 38%. Average intake time fell from 14 minutes to 4.',
 '[{"label":"Adoption","value":"4% → 71%"},{"label":"Inbound calls","value":"-38%"},{"label":"Intake time","value":"14m → 4m"}]'::jsonb,
 array['digital-strategy','web-mobile','design-branding'],
 'lavender','published',false,40),
('saas-onboarding-automation','Loop Analytics','Doubling activation with a smarter onboarding engine','smb','Professional services',
 'A 14-person SaaS startup automated onboarding and doubled activation in eight weeks.',
 'Trial users dropped off in week one. Founders were manually shipping onboarding emails and demo calls.',
 'We mapped the activation funnel, built a behavioural automation layer (Customer.io + custom events), and added an AI co-pilot for in-app guidance.',
 'Activation rate moved from 18% to 41%. Founders reclaimed ~14 hours per week. NPS rose 19 points.',
 '[{"label":"Activation","value":"18% → 41%"},{"label":"Founder hours saved","value":"14h/week"},{"label":"NPS uplift","value":"+19"}]'::jsonb,
 array['automation-ai','analytics-growth','crm-sales'],
 'rose','published',false,50)
on conflict (slug) do nothing;

-- ============================================================================
-- Insights
-- ============================================================================
insert into public.insights (slug, title, excerpt, body, author, author_role, category, read_time, status, published_at) values
('the-new-shape-of-digital-transformation','The new shape of digital transformation',
 'Five-year ERP programs are dead. Here''s what''s replacing them — and why your roadmap probably needs a rewrite.',
 array[
   'For two decades, ''digital transformation'' meant signing a multi-year contract with a giant consultancy and hoping the org survived the ride. That model is collapsing under its own weight.',
   'The companies winning today are running 90-day strike teams: small, multidisciplinary squads with executive air cover. They ship something useful within a quarter, measure it, and decide what to scale.',
   'The transformation roadmap of 2026 is a portfolio of bets — not a Gantt chart. We help leadership teams put one together and execute on it.'
 ],
 'Lena Okafor','Head of Strategy','Strategy','6 min read','published','2026-04-18T00:00:00Z'),
('ai-agents-that-actually-pay-back','AI agents that actually pay back',
 'Most AI ''pilots'' never reach production. Here''s the operating model we use to ship AI agents that survive contact with reality.',
 array[
   'There are four reasons AI projects die: unclear ownership, fuzzy success criteria, brittle integrations, and zero monitoring. We''ve shipped over thirty production AI workflows. The pattern that works is boring.',
   'Start narrow. Pick one process, measure baseline cycle time and quality, build the agent against a clear evaluation set, ship it behind a feature flag, monitor everything.',
   'If it can''t survive a week in production with a junior on call, it isn''t real software yet.'
 ],
 'Marcus Tan','AI Lead','AI','8 min read','published','2026-04-05T00:00:00Z'),
('designing-b2b-products-that-feel-consumer','Designing B2B products that feel consumer-grade',
 'The aesthetic gap between consumer and enterprise software is closing fast. Here''s the design system playbook.',
 array[
   'Buyers of enterprise software are also the people who use Spotify, Notion, and Linear at home. Tolerance for ugly enterprise UI has collapsed.',
   'We treat every B2B product as a consumer product with extra constraints — security, compliance, multi-tenancy. The aesthetic bar is the same.',
   'Design systems are the cheat code. A small, well-built token system pays back across every screen for years.'
 ],
 'Priya Shah','Design Director','Design','5 min read','published','2026-03-22T00:00:00Z'),
('the-rise-of-the-business-operating-system','The rise of the business operating system',
 'SaaS sprawl is a tax. The next decade belongs to companies that build a coherent operating layer across CRM, ops, finance, and AI.',
 array[
   'Mid-market companies now run on an average of 137 SaaS products. The cost isn''t just the licenses — it''s the cognitive load of orchestrating them.',
   'We''re seeing a new pattern emerge: a thin operating layer (built on workflow engines, AI agents, and shared data) that sits above the SaaS stack and presents one coherent surface to the business.',
   'This is where DigSolutions is heading — and it''s why our client portal is the start of something bigger.'
 ],
 'Lena Okafor','Head of Strategy','Operations','9 min read','published','2026-03-08T00:00:00Z'),
('stop-shipping-marketing-sites-without-instrumentation','Stop shipping marketing sites without instrumentation',
 'If you can''t tell a useful story about which page changed which deal, your marketing site is decoration.',
 array[
   'Every site we ship leaves the building with PostHog, GA4, server-side events, and a clear funnel definition in place.',
   'It costs almost nothing to set up on launch day and is painful to retrofit six months later. Do it now.',
   'The point isn''t dashboards — it''s the conversations they enable between marketing, sales, and product.'
 ],
 'Jordan Reyes','Growth Engineer','Engineering','4 min read','published','2026-02-19T00:00:00Z')
on conflict (slug) do nothing;

-- ============================================================================
-- Guides
-- ============================================================================
insert into public.guides (slug, title, excerpt, format, pages, status, sort_order) values
('digital-transformation-audit','The 30-minute digital transformation audit','A self-serve scorecard to identify the three highest-leverage initiatives in your business.','Worksheet',12,'published',10),
('ai-readiness-checklist','AI readiness checklist for mid-market companies','Fourteen prerequisites your data, ops, and team need before AI can deliver real ROI.','Checklist',8,'published',20),
('vendor-evaluation-framework','Vendor evaluation framework','The same scorecard we use internally when evaluating CRMs, CMSs, and infrastructure providers.','PDF',18,'published',30)
on conflict (slug) do nothing;

-- ============================================================================
-- Testimonials
-- ============================================================================
insert into public.testimonials (quote, name, role, company, status, sort_order) values
('DigSolutions rebuilt our entire customer experience in a quarter. Honestly the most disciplined agency partner we''ve worked with.','Elena Park','Chief Operating Officer','Cedar Health Network','published',10),
('They took six different vendors'' worth of work and absorbed it into one accountable team. Our board calls them our ''tenth executive''.','Marcus DeWitt','Chief Executive Officer','Meridian Financial Group','published',20),
('We expected a website. We got a transformation roadmap, a CRM, an analytics stack, and a team that still picks up the phone two years later.','Renée Albright','Founder','Northwind Outfitters','published',30),
('Their AI work is the first I''ve seen that wasn''t built for a slide. It''s in production, it''s monitored, and it pays back.','Sven Holstad','VP of Operations','Forge & Field Manufacturing','published',40);

-- ============================================================================
-- Team members
-- ============================================================================
insert into public.team_members (name, role, bio, status, sort_order) values
('Lena Okafor','Co-founder & Head of Strategy','Former BCG principal. Builds digital strategy roadmaps for SMB through enterprise.','published',10),
('Marcus Tan','Co-founder & Head of Engineering','Ex-Stripe, ex-Vercel. Loves boring infrastructure and AI that actually ships.','published',20),
('Priya Shah','Design Director','Built design systems at Shopify and Linear. Believes in editorial restraint.','published',30),
('Jordan Reyes','Head of Growth','Performance marketing and growth engineering for B2B SaaS.','published',40),
('Amara Ndlovu','Head of Delivery','Twenty years of program leadership in regulated industries.','published',50),
('Toby Mackenzie','AI Lead','Builds production AI agents and evaluation pipelines.','published',60);

-- ============================================================================
-- Open roles
-- ============================================================================
insert into public.open_roles (slug, title, team, location, employment_type, status) values
('senior-product-designer','Senior product designer','Design','Remote (EU/Africa)','Full-time','published'),
('ai-engineer','AI engineer','Engineering','Remote (global)','Full-time','published'),
('fullstack-engineer','Full-stack engineer (Next.js / TS)','Engineering','Remote (EU)','Full-time','published'),
('delivery-lead','Delivery lead — enterprise','Delivery','Hybrid (Kigali / London)','Full-time','published')
on conflict (slug) do nothing;

-- ============================================================================
-- Site settings singleton
-- ============================================================================
insert into public.site_settings (id, brand, contact, social, seo_defaults, pricing_tiers) values (1,
 jsonb_build_object(
   'name','DigSolutions',
   'legal','Digital Solutions Co.',
   'tagline','Transform. Digitize. Scale.',
   'description','DigSolutions is a digital business transformation partner for SMBs, mid-market companies, and enterprises.'
 ),
 jsonb_build_object('email','hello@digsolutions.co','phone','+1 (555) 010-1234'),
 jsonb_build_object(
   'linkedin','https://linkedin.com/company/digsolutions',
   'x','https://x.com/digsolutions',
   'instagram','https://instagram.com/digsolutions',
   'youtube','https://youtube.com/@digsolutions'
 ),
 jsonb_build_object('keywords', array['digital transformation','agency','AI','automation','CRM','SaaS']),
 '[{"name":"Launch","price":"From $4,900","cadence":"project"},{"name":"Growth","price":"From $9,800","cadence":"/ month","featured":true},{"name":"Enterprise","price":"Custom","cadence":"MSA"}]'::jsonb
)
on conflict (id) do nothing;
