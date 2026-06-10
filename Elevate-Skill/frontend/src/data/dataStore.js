const STORE_KEY = 'elevate_data';

const genId = () => Date.now() + Math.random();

const defaults = {
  heroSlides: [],
  courses: [
    {
      id: 'c1',       title: 'Modern Front-End Development with React & TypeScript', category: 'Development',
      desc: 'Master React, TypeScript, and modern front-end architectures. Build production-ready applications from scratch.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      students: 1245, duration: '16 weeks', lessons: 48, level: 'Beginner to Advanced', color: '#3C83F6', price: '500 ETB', status: 'Active'
    },
    {
      id: 'c2', title: 'UI/UX Design Mastery', category: 'Design',
      desc: 'Prototyping, user-centric systems, and design thinking. Create interfaces that users love.',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600',
      students: 989, duration: '12 weeks', lessons: 36, level: 'All Levels', color: '#f89f29', price: '450 ETB', status: 'Active'
    },
    {
      id: 'c3', title: 'AI & Machine Learning', category: 'AI',
      desc: 'LLMs, Neural Networks, and practical AI. Build real-world intelligent systems.',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600',
      students: 1312, duration: '20 weeks', lessons: 52, level: 'Intermediate', color: '#17c966', price: '600 ETB', status: 'Active'
    },
    {
      id: 'c4', title: 'Cloud & DevOps Engineering', category: 'Infrastructure',
      desc: 'Docker, Kubernetes, AWS, and CI/CD pipelines. Deploy and scale applications with confidence.',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600',
      students: 756, duration: '14 weeks', lessons: 40, level: 'Intermediate', color: '#15c8fb', price: '550 ETB', status: 'Active'
    }
  ],
  testimonials: [
    { id: 't1', name: 'DAWIT MEKONNEN', role: 'Senior Fullstack Engineer', company: 'Addis Tech Hub', video: 'https://www.youtube.com/embed/aqz-KE-bpKQ', story: 'The transition from finance to tech seemed impossible until I joined. The project-based approach taught me how to architect complex systems. I doubled my salary in six months.', color: '#3C83F6' },
    { id: 't2', name: 'SELAMAWIT BEKELE', role: 'UI/UX Lead', company: 'Creative Flow Agency', video: 'https://www.youtube.com/embed/c9Wg6A_9f4U', story: 'Most courses focus on tools, but here I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio that landed me a lead role.', color: '#f89f29' },
    { id: 't3', name: 'ABENEZER LEMMA', role: 'AI Researcher', company: 'Neural Systems', video: 'https://www.youtube.com/embed/aircAruvnKk', story: 'While others were talking about AI, we were building LLM integrations. The curriculum is consistently six months ahead of the industry standards.', color: '#3C83F6' }
  ],
  posts: [
    { id: 'p1', title: 'Why Full-Stack Development is the Future', author: 'Admin', date: '2026-05-20', status: 'Published', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', excerpt: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams.' },
    { id: 'p2', title: 'UI/UX Trends for 2026', author: 'Admin', date: '2026-05-18', status: 'Published', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600', excerpt: 'Stay ahead of the curve with these emerging design trends that are shaping how users interact with digital products.' }
  ],
  announcements: [],
  payments: [
    {
      id: genId(), full_name: 'Dawit Mekonnen', email: 'dawit@example.com',
      phone: '+251 911 234 567', amount: '500', course: 'Full-Stack Web Development',
      comment: 'Payment for Full-Stack course',
      proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      status: 'Pending', submitted_at: '2026-06-01'
    },
    {
      id: genId(), full_name: 'Selamawit Bekele', email: 'selam@example.com',
      phone: '+251 922 345 678', amount: '450', course: 'UI/UX Design Mastery',
      comment: 'Course fee payment',
      proof_url: 'https://images.unsplash.com/photo-1560472354-b33dd0b9985c?w=400',
      status: 'Approved', submitted_at: '2026-05-28'
    }
  ],
  registrations: []
};

export function loadData(key) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      if (store[key] && store[key].length > 0) return store[key];
    }
  } catch {
    return defaults[key] || [];
  }
  return defaults[key] || [];
}

export function saveData(key, value) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[key] = value;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    return;
  }
}
