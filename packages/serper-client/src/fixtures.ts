import { SerpSnapshot, NewsResult, PlacesResult } from '@rivue/types';

export const MOCK_SERP_FIXTURES: Record<string, any> = {
  'crm software': {
    searchParameters: { q: 'crm software', gl: 'us', hl: 'en', num: 10, type: 'search' },
    knowledgeGraph: {
      title: 'Customer Relationship Management',
      type: 'Software Category',
      description: 'Customer relationship management is a process in which a business or other organization administers its interactions with customers, typically using data analysis to study large amounts of information.',
      website: 'https://en.wikipedia.org/wiki/Customer_relationship_management',
    },
    organic: [
      {
        position: 1,
        title: 'HubSpot: Free CRM Software for Small and Mid-Sized Businesses',
        link: 'https://www.hubspot.com/products/crm',
        snippet: 'HubSpot\'s CRM is easy to use, intuitive, and includes everything your sales, marketing, and service teams need to build deeper relationships.',
        sitelinks: [
          { title: 'Pricing', link: 'https://www.hubspot.com/pricing/crm' },
          { title: 'Features', link: 'https://www.hubspot.com/products/crm/features' },
          { title: 'Demo', link: 'https://www.hubspot.com/products/crm/demo' },
        ],
      },
      {
        position: 2,
        title: 'Salesforce: The #1 AI CRM for Business Growth',
        link: 'https://www.salesforce.com/crm/',
        snippet: 'Grow your business faster with Salesforce Customer 360, the integrated CRM platform that powers your entire suite of connected apps.',
      },
      {
        position: 3,
        title: 'Zoho CRM | Top-Rated Customer Relationship Management',
        link: 'https://www.zoho.com/crm/',
        snippet: 'Zoho CRM empowers a global network of over 250,000 businesses in 180 countries to convert more leads, engage with customers, and grow revenue.',
      },
      {
        position: 4,
        title: 'Pipedrive: Sales CRM & Pipeline Management Software',
        link: 'https://www.pipedrive.com/',
        snippet: 'Pipedrive is the easy-to-use, #1 user-rated CRM tool. Calculate your revenue growth and start a 14-day free trial today.',
      },
      {
        position: 5,
        title: 'Monday Sales CRM: Simple, Customizable CRM',
        link: 'https://monday.com/crm',
        snippet: 'Manage your entire sales cycle, from lead to post-sales, in one centralized workspace. Try Monday.com CRM free.',
      },
      {
        position: 6,
        title: 'Freshsales CRM: Modern Sales Automation & AI Insights',
        link: 'https://www.freshworks.com/crm/sales/',
        snippet: 'Supercharge your sales team with an AI-powered sales CRM that delivers high-velocity revenue growth.',
      },
      {
        position: 7,
        title: 'Best CRM Software for 2026 | Forbes Advisor',
        link: 'https://www.forbes.com/advisor/business/software/best-crm-software/',
        snippet: 'We reviewed the best CRM software for small businesses, comparing pricing, features, user interface, and integrations.',
      },
      {
        position: 8,
        title: 'Top 10 CRM Software Solutions for SMBs - G2',
        link: 'https://www.g2.com/categories/crm',
        snippet: 'Discover the top CRM Software with real user reviews, product rankings, and feature comparisons from verified buyers.',
      }
    ],
    peopleAlsoAsk: [
      {
        question: 'What is CRM software used for?',
        snippet: 'CRM software is used to manage customer interactions, automate sales pipelines, organize lead data, track communications, and forecast revenue.',
        title: 'What is CRM? Guide to Customer Relationship Management',
        link: 'https://www.salesforce.com/crm/what-is-crm/'
      },
      {
        question: 'What are the 3 types of CRM?',
        snippet: 'The three primary types of CRM software are Collaborative CRM, Analytical CRM, and Operational CRM.',
        title: 'The 3 Main Types of CRM - TechTarget',
        link: 'https://www.techtarget.com/searchcustomerexperience/tip/3-main-types-of-CRM'
      },
      {
        question: 'Is HubSpot CRM really 100% free?',
        snippet: 'Yes, HubSpot offers a 100% free version of its core CRM features with no time limit and up to 1,000,000 contacts.',
        title: 'HubSpot Free CRM FAQ',
        link: 'https://www.hubspot.com/pricing/crm'
      }
    ],
    relatedSearches: [
      { query: 'best crm software for small business' },
      { query: 'crm software free' },
      { query: 'crm software examples' },
      { query: 'best sales crm 2026' },
      { query: 'open source crm' },
      { query: 'crm pricing comparison' }
    ]
  },
  'seo tools': {
    searchParameters: { q: 'seo tools', gl: 'us', hl: 'en', num: 10, type: 'search' },
    knowledgeGraph: {
      title: 'Search Engine Optimization Tools',
      type: 'Software Category',
      description: 'SEO tools are software utilities and web applications designed to analyze, track, and optimize websites for higher search engine visibility.',
    },
    organic: [
      {
        position: 1,
        title: 'Ahrefs - SEO Tools & Resources to Grow Your Search Traffic',
        link: 'https://ahrefs.com',
        snippet: 'You don\'t have to be an SEO pro to rank higher and get more traffic. Ahrefs provides comprehensive backlink and keyword research tools.',
      },
      {
        position: 2,
        title: 'Semrush - Online Marketing, SEO & Competitor Analysis',
        link: 'https://www.semrush.com',
        snippet: 'Semrush is an all-in-one suite for improving online visibility and discovering marketing insights. Trusted by over 10M digital marketers.',
      },
      {
        position: 3,
        title: 'Mangools: Juicy SEO Tools You\'ll Love',
        link: 'https://mangools.com',
        snippet: 'Boost your SEO with KWFinder, SERPChecker, SERPWatcher, LinkMiner and SiteProfiler. Easy to use, great design, affordable pricing.',
      },
      {
        position: 4,
        title: 'Rivue — The Next-Gen Competitor & SEO Platform',
        link: 'https://rivue.io',
        snippet: 'Rivue brings keyword research, site audits, backlinks, digital PR, and social growth together into one single pane of glass.',
      },
      {
        position: 5,
        title: 'Google Search Console',
        link: 'https://search.google.com/search-console',
        snippet: 'Search Console tools and reports help you measure your site\'s Search traffic and performance, fix issues, and make your site shine in Google Search results.',
      }
    ],
    peopleAlsoAsk: [
      {
        question: 'What are the top 5 SEO tools?',
        snippet: 'The most popular SEO tools include Ahrefs, Semrush, Rivue, Moz Pro, and Google Search Console.',
        title: 'Best SEO Tools Compared',
        link: 'https://searchengineland.com/best-seo-tools'
      },
      {
        question: 'Is Semrush or Ahrefs better for beginners?',
        snippet: 'Semrush offers a broader marketing toolkit, while Ahrefs is renowned for its depth in backlink index and keyword research.',
        title: 'Ahrefs vs Semrush Comprehensive Breakdown',
        link: 'https://backlinko.com/ahrefs-vs-semrush'
      }
    ],
    relatedSearches: [
      { query: 'free seo tools' },
      { query: 'best seo tools for beginners' },
      { query: 'keyword research tools' },
      { query: 'technical seo audit tools' }
    ]
  }
};

export const MOCK_NEWS_FIXTURES: NewsResult[] = [
  {
    title: 'Google Announces Core Algorithm Update with Focus on Helpful Content',
    link: 'https://searchengineland.com/google-core-update-2026',
    snippet: 'Google has released its first major search algorithm update of 2026, targeting AI-spam and rewarding first-hand authority.',
    source: 'Search Engine Land',
    date: '2 hours ago',
  },
  {
    title: 'Rivue Launches Unified SEO, PR & Social Extension for Growth Marketers',
    link: 'https://techcrunch.com/2026/08/rivue-launch-announcement',
    snippet: 'Rivue, a unified SEO and digital PR platform, announced its Manifest V3 Chrome extension offering live on-page intelligence.',
    source: 'TechCrunch',
    date: '1 day ago',
  },
  {
    title: 'Digital PR Trends 2026: Why Unlinked Brand Mentions Drive Real Authority',
    link: 'https://hubspot.com/marketing/digital-pr-trends',
    snippet: 'A deep dive into how journalists discover expert sources and how proactive outreach leads to tier-one editorial links.',
    source: 'HubSpot Blog',
    date: '3 days ago',
  }
];

export const MOCK_PLACES_FIXTURES: PlacesResult[] = [
  {
    position: 1,
    title: 'Downtown Digital Growth Agency',
    address: '100 Market St, San Francisco, CA 94105',
    rating: 4.9,
    ratingCount: 128,
    category: 'Marketing Agency',
    phoneNumber: '(415) 555-0199',
    website: 'https://downtowndigital.com',
  },
  {
    position: 2,
    title: 'Bay Area SEO & PR Specialists',
    address: '456 Montgomery St, San Francisco, CA 94104',
    rating: 4.7,
    ratingCount: 94,
    category: 'Internet Marketing Service',
    phoneNumber: '(415) 555-0244',
    website: 'https://bayareaseopr.com',
  }
];
