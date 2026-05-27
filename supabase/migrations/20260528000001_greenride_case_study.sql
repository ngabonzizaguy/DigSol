-- Replace placeholder Northwind retail copy with Greenride Africa (client project).

update public.case_studies
set
  slug = 'greenride-africa-mobility',
  client = 'Greenride Africa',
  title = 'Rwanda''s electric ride platform — app, web, and ops shipped together',
  industry = 'Mobility & ride-hailing',
  summary =
    'Greenride Africa, a fully electric mobility startup in Kigali, needed a passenger app, marketing website, and booking backbone before launching on city streets — without cloning legacy fuel-based taxi stacks.',
  challenge =
    'Riders expected reliable EV trips booked in seconds; operations still ran on spreadsheets and chat threads. The brand had to earn trust as a local, sustainable alternative — not a generic ride template. Leadership wanted mobile, web, and backend delivered by one accountable team ahead of a public launch.',
  approach =
    'We designed and built the passenger mobile experience and responsive web presence, unified ride requests and trip status on Supabase + Vercel, and added an operations-friendly admin layer for bookings and fleet visibility. Notifications, payments, and analytics were wired for day-one service across Kigali — ride-hailing, VIP, corporate, and airport runs on one platform.',
  outcome =
    'Greenride launched with a 100% electric fleet on Kigali streets — clean, quiet rides built for local riders. Bookings flow through the app; corporate and VIP programs share the same core. The stack is ready to extend into delivery and charging as the network grows across Rwanda.',
  metrics = '[
    {"label": "Fleet", "value": "100% electric"},
    {"label": "Services live", "value": "Ride · VIP · Corp"},
    {"label": "Market", "value": "Kigali, Rwanda"}
  ]'::jsonb,
  service_slugs = array['web-mobile', 'digital-strategy', 'automation-ai'],
  orb = 'mint',
  customer_quote =
    'No fuel. No noise. No pollution — just clean, electric rides made for our people, with software we can actually run the business on.',
  customer_name = 'Greenride Africa team',
  customer_role = 'Founding team',
  project_url = 'https://play.google.com/store/apps/details?id=com.greenrideafrica.passenger',
  show_project_url = true,
  featured = true
where slug = 'smb-retail-cloud-migration';
