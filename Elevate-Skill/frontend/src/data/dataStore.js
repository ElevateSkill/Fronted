// Local fallback data store. Field names mirror the backend serializers
// (see backend/docs/api_contract.md).
const STORE_KEY = 'elevate_data';

const defaults = {
  // Hero is a singleton on the backend, but we keep a small array
  // to power the local carousel. Backend (via /homepage/) returns one.
  heroSlides: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070',
      title: 'ELEVATE',
      highlight: 'SKILL',
      subtitle: 'Project-based learning platform designed for the modern engineer.',
      cta: 'GET STARTED',
      color: '#EE8433',
      active: true
    }
  ],

  // Courses — backend: { id, title, short_description, description,
  //                       category: {id, name, slug}, price, duration,
  //                       lessons, instructor, is_active, is_published, thumbnail }
  courses: [
    {
      id: 1, title: 'Full-Stack Web Development',
      short_description: 'Master React, Node.js, and scalable architectures. Build production-ready applications from scratch.',
      description: 'Master React, Node.js, and scalable architectures. Build production-ready applications from scratch with industry-standard tooling and real-world projects.',
      category: { id: 1, name: 'Development', slug: 'development' },
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      price: '500 ETB', duration: '16 weeks', lessons: 48, instructor: 'Senior Mentor',
      is_active: true, is_published: true, status: 'Active',
      icon: 'Code2', color: '#EE8433'
    },
    {
      id: 2, title: 'UI/UX Design Mastery',
      short_description: 'Prototyping, user-centric systems, and design thinking. Create interfaces that users love.',
      description: 'Prototyping, user-centric systems, and design thinking. Create interfaces that users love with Figma, motion design and accessibility-first patterns.',
      category: { id: 2, name: 'Design', slug: 'design' },
      thumbnail: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600',
      price: '450 ETB', duration: '12 weeks', lessons: 36, instructor: 'Design Lead',
      is_active: true, is_published: true, status: 'Active',
      icon: 'Palette', color: '#3A3992'
    },
    {
      id: 3, title: 'AI & Machine Learning',
      short_description: 'LLMs, Neural Networks, and practical AI. Build real-world intelligent systems.',
      description: 'LLMs, Neural Networks, and practical AI. Build real-world intelligent systems using modern frameworks and deploy them to production.',
      category: { id: 3, name: 'AI', slug: 'ai' },
      thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
      price: '600 ETB', duration: '20 weeks', lessons: 52, instructor: 'AI Researcher',
      is_active: true, is_published: true, status: 'Active',
      icon: 'BrainCircuit', color: '#5A2DA8'
    },
    {
      id: 4, title: 'Cloud & DevOps Engineering',
      short_description: 'Docker, Kubernetes, AWS, and CI/CD pipelines. Deploy and scale applications with confidence.',
      description: 'Docker, Kubernetes, AWS, and CI/CD pipelines. Deploy and scale applications with confidence using industry best practices.',
      category: { id: 4, name: 'Infrastructure', slug: 'infrastructure' },
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600',
      price: '550 ETB', duration: '14 weeks', lessons: 40, instructor: 'DevOps Lead',
      is_active: true, is_published: true, status: 'Active',
      icon: 'Rocket', color: '#5A2DA8'
    }
  ],

  // Testimonials — backend: { id, student_name, student_image, message,
  //                            rating, is_active, created_at }
  testimonials: [
    {
      id: 1,
      student_name: 'Dawit Mekonnen',
      student_image: 'https://i.pravatar.cc/600?img=12',
      message: 'The transition from finance to tech seemed impossible until I joined. The project-based approach taught me how to architect complex systems. I doubled my salary in six months.',
      rating: 5,
      is_active: true
    },
    {
      id: 2,
      student_name: 'Selamawit Bekele',
      student_image: 'https://i.pravatar.cc/600?img=32',
      message: 'Most courses focus on tools, but here I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio that landed me a lead role.',
      rating: 5,
      is_active: true
    },
    {
      id: 3,
      student_name: 'Abenezer Lemma',
      student_image: 'https://i.pravatar.cc/600?img=15',
      message: 'While others were talking about AI, we were building LLM integrations. The curriculum is consistently six months ahead of the industry standards.',
      rating: 5,
      is_active: true
    },
    {
      id: 4,
      student_name: 'Hana Getachew',
      student_image: 'https://i.pravatar.cc/600?img=47',
      message: 'This did not feel like a generic course. The structure, the feedback, and the results-oriented lessons made it easy to stay focused and actually finish strong.',
      rating: 5,
      is_active: true
    }
  ],

  // News (blog) — backend: { id, title, excerpt, content, image, author, status, ... }
  posts: [
    {
      id: 1, title: 'Why Full-Stack Development is the Future',
      author: { full_name: 'Admin' },
      excerpt: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams.',
      content: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      status: 'published',
      created_at: '2026-05-20'
    },
    {
      id: 2, title: 'UI/UX Trends for 2026',
      author: { full_name: 'Admin' },
      excerpt: 'Stay ahead of the curve with these emerging design trends that are shaping how users interact with digital products.',
      content: 'Stay ahead of the curve with these emerging design trends that are shaping how users interact with digital products.',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600',
      status: 'published',
      created_at: '2026-05-18'
    },
    {
      id: 3, title: 'How AI is Reshaping Engineering Education',
      author: { full_name: 'Admin' },
      excerpt: 'From personalized learning paths to AI tutors — discover how artificial intelligence is transforming the way engineers learn and grow.',
      content: 'From personalized learning paths to AI tutors — discover how artificial intelligence is transforming the way engineers learn and grow.',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
      status: 'published',
      created_at: '2026-05-10'
    }
  ],

  // Announcements — backend: { id, title, content, date, is_published, ... }
  announcements: [
    { id: 1, title: '🎓 New Cohort Open', content: 'Registration is now open for the Full-Stack Web Development cohort — starts July 15, 2026', is_published: true, date: '2026-06-01' },
    { id: 2, title: '🚀 Early Bird Discount', content: 'Get 20% off on the AI & Machine Learning program — limited seats available!', is_published: true, date: '2026-06-03' },
    { id: 3, title: '🏆 Buildathon 2026', content: 'Join the Elevate Buildathon 2026 and win prizes worth up to 50,000 ETB', is_published: true, date: '2026-06-05' },
    { id: 4, title: '🎯 Free Mentorship Session', content: 'Book a free 1:1 career mentorship with our senior engineers this Saturday', is_published: true, date: '2026-06-06' }
  ],

  // FAQs — backend: { id, question, answer, order, is_active, ... }
  faqs: [
    { id: 1, question: 'How long do I have access to the courses?', answer: 'You get lifetime access to all purchased courses. This includes all future updates, new modules, and downloadable resources added to the curriculum.', order: 1, is_active: true },
    { id: 2, question: 'Do I receive a certificate after completion?', answer: 'Yes! Upon finishing all modules and passing the final project, you will receive a verified digital certificate that you can add to your LinkedIn profile.', order: 2, is_active: true },
    { id: 3, question: 'Can I switch learning paths later?', answer: 'Absolutely. Our flexible system allows you to pivot between Web Dev, AI, and Design paths at any time. Your progress in foundational modules will be saved.', order: 3, is_active: true },
    { id: 4, question: 'Is there a community for support?', answer: "You'll be invited to our private Discord community where 20,000+ students and industry mentors provide 24/7 technical support and code reviews.", order: 4, is_active: true }
  ]
};

export function loadData(key) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      if (store[key] && store[key].length > 0) return store[key];
    }
  } catch {}
  return defaults[key] || [];
}

export function saveData(key, value) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[key] = value;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

export function clearData(key) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const store = JSON.parse(raw);
    if (key) delete store[key];
    else Object.keys(store).forEach((k) => delete store[k]);
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

export { defaults };
export default defaults;
