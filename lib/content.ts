// Default public content. Stage 5 (admin) moves services/portfolio/products to the database; this is the fallback.
export const NAV = [["Home","/"],["Services","/#services"],["Digital Invitations","/invitations"],["Products","/#products"],["Portfolio","/#portfolio"],["About","/#about"],["Contact","/#contact"]] as const;
export const CAPABILITIES = ["Web Development","Digital Invitations","Data Solutions","Creative Design","Custom Applications","Automation"];
export const SERVICES = [
  { name:"Web Development", desc:"Modern, responsive websites and web applications built for businesses, organizations and individuals.", features:["Business websites","E-commerce","Web applications","Portfolios","Booking systems","Custom dashboards"], cta:"Learn More", href:"/#contact" },
  { name:"Digital Invitations", desc:"Create beautiful, interactive invitations that your guests can open, RSVP to and share from their phones.", features:["Weddings","Birthdays","Graduations","Naming ceremonies","Corporate events","Church events"], cta:"Create Invitation", href:"/invitations" },
  { name:"Creative Design", desc:"Professional visual designs that help your brand and events stand out.", features:["Logo design","Branding","Flyers","Social media graphics","Presentations","Event graphics"], cta:"Explore Design", href:"/#contact" },
  { name:"Data & Business Solutions", desc:"Turn your business data into useful information with dashboards, reports and automation.", features:["Excel systems","Dashboards","Power BI","Data analysis","Reports","Business automation"], cta:"Explore Data", href:"/#contact" },
];
export const STEPS = [["01","Tell Us","Tell us what you need."],["02","We Plan","We turn your idea into a practical digital solution."],["03","We Build","We design, develop and test your project."],["04","You Launch","Your finished solution is ready to use and share."]];
export const PORTFOLIO = [
  { name:"Royal Rangers Membership System", cat:"Web Application", desc:"Membership and welfare management for Royal Rangers Bayelsa State." },
  { name:"Imani Collections", cat:"E-commerce", desc:"Full-stack progressive web app for a luxury retail brand." },
  { name:"Aviation Dashboard", cat:"Dashboard", desc:"Operational dashboards for aviation air traffic and meteorological data." },
  { name:"Digital Event Invitation", cat:"Digital Invitation", desc:"Interactive invitation with countdown, RSVP and sharing." },
  { name:"Business Management System", cat:"Data & Automation", desc:"Excel and web based systems for day to day business operations." },
];
export const PRODUCT_CATS = ["Excel Systems","Business Templates","Dashboards","AI Guides","Digital Resources","Professional Templates"];
export const EVENT_CATEGORIES = ["Wedding","Birthday","Naming Ceremony","Graduation","Anniversary","Traditional Ceremony","Church Event","Corporate Event","Conference","Baby Shower","Bridal Shower","Engagement","Dinner","Celebration","Funeral / Celebration of Life","Other"];
