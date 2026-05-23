export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "DigSolutions rebuilt our entire customer experience in a quarter. Honestly the most disciplined agency partner we've worked with.",
    name: "Elena Park",
    role: "Chief Operating Officer",
    company: "Cedar Health Network",
  },
  {
    quote:
      "They took six different vendors' worth of work and absorbed it into one accountable team. Our board calls them our 'tenth executive'.",
    name: "Marcus DeWitt",
    role: "Chief Executive Officer",
    company: "Meridian Financial Group",
  },
  {
    quote:
      "We expected a website. We got a transformation roadmap, a CRM, an analytics stack, and a team that still picks up the phone two years later.",
    name: "Renée Albright",
    role: "Founder",
    company: "Northwind Outfitters",
  },
  {
    quote:
      "Their AI work is the first I've seen that wasn't built for a slide. It's in production, it's monitored, and it pays back.",
    name: "Sven Holstad",
    role: "VP of Operations",
    company: "Forge & Field Manufacturing",
  },
];
