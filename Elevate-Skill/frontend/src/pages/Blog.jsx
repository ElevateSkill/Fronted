import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronRight, ChevronUp } from 'lucide-react';
import { api, unwrapResults, getMediaUrl } from '../services/api';

const fallbackPosts = [
  {
    id: 'p1', title: 'Why Full-Stack Development is the Future', author: 'Elevate Skill Team', date: 'Jun 10, 2026',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    excerpt: 'Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams.',
    content: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams. Companies today are looking for versatile engineers who can navigate the entire stack, from database design to responsive UIs. Our comprehensive full-stack program covers React, Node.js, PostgreSQL, and cloud deployment, ensuring you graduate with real-world skills that employers demand. You will build complete web applications from scratch, learning how to design RESTful APIs, manage databases, and create seamless user interfaces. By the end of the program, you will have a portfolio of full-stack projects that demonstrate your ability to deliver end-to-end solutions.'
  },
  {
    id: 'p2', title: 'Master Digital Marketing in the AI Era', author: 'Elevate Skill Team', date: 'Jun 9, 2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    excerpt: 'Learn how to leverage AI tools, SEO strategies, and social media algorithms to build a thriving digital presence.',
    content: 'Digital marketing has transformed dramatically with the rise of AI and machine learning. Our Digital Marketing program covers the complete spectrum of modern marketing: SEO optimization, Google Ads, Facebook and Instagram advertising, content marketing, email automation, and AI-powered analytics. You will learn how to create data-driven campaigns that convert, understand customer behavior through analytics, and master the art of storytelling across platforms. We dive deep into TikTok and Instagram Reels strategies, LinkedIn networking, and YouTube growth hacking. With hands-on projects managing real campaigns, you will graduate ready to drive measurable results for any business in the digital economy.'
  },
  {
    id: 'p3', title: 'Video Editing: From Beginner to Content Creator', author: 'Elevate Skill Team', date: 'Jun 8, 2026',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600',
    excerpt: 'Master the art of video editing with industry-standard tools and techniques used by top content creators.',
    content: 'Video content dominates the internet, and skilled editors are in high demand. Our Video Editing course takes you from absolute beginner to professional content creator. You will master industry-standard tools including Adobe Premiere Pro, After Effects, and DaVinci Resolve. Learn essential techniques: cutting and trimming, color grading, motion graphics, audio mixing, transitions, and visual effects. We cover storytelling through editing, pacing, creating engaging social media content for TikTok, YouTube, and Instagram Reels, and professional filming techniques. You will complete projects including promotional videos, vlogs, short films, and social media content that will build your portfolio and prepare you for freelance or full-time work in the growing video production industry.'
  },
  {
    id: 'p4', title: 'Graphics Design: Visual Communication That Captivates', author: 'Elevate Skill Team', date: 'Jun 7, 2026',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    excerpt: 'Unlock your creative potential with professional design skills using Photoshop, Illustrator, and Figma.',
    content: 'Great design communicates ideas instantly and leaves lasting impressions. Our Graphics Design program teaches you the principles of visual communication: typography, color theory, layout composition, branding, and user-centered design. You will master Adobe Photoshop for photo manipulation and digital art, Adobe Illustrator for vector graphics and logo design, and Figma for UI/UX design and prototyping. Through real-world projects, you will design logos, brand identities, social media graphics, marketing materials, website mockups, and mobile app interfaces. Learn how to work with clients, present your work professionally, and build a standout portfolio that opens doors to agency jobs, freelance opportunities, or your own design studio.'
  },
  {
    id: 'p5', title: 'Virtual Assistance: Build a Remote Career That Works for You', author: 'Elevate Skill Team', date: 'Jun 6, 2026',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
    excerpt: 'Learn the skills to become a high-earning virtual assistant and work remotely for global clients.',
    content: 'The demand for skilled virtual assistants has exploded as businesses go remote. Our Virtual Assistance program prepares you for a flexible, high-income career supporting executives and entrepreneurs worldwide. You will learn essential tools: Google Workspace, Microsoft Office 365, project management platforms (Trello, Asana, Monday.com), CRM systems (HubSpot, Salesforce), calendar management, email handling, and travel coordination. We cover advanced skills including social media management, basic bookkeeping, data entry, customer support, and workflow automation using Zapier and Make. You will also learn how to find clients on Upwork, Fiverr, and LinkedIn, set your rates, and build a sustainable remote business. Start your journey to location independence today.'
  },
  {
    id: 'p6', title: 'Mobile App Development: Build the Next Big App', author: 'Elevate Skill Team', date: 'Jun 5, 2026',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
    excerpt: 'From idea to app store — learn to build cross-platform mobile applications using React Native and modern tools.',
    content: 'Mobile apps drive the modern economy, and developers who can build them are in extraordinary demand. Our Application Development program focuses on cross-platform development using React Native, allowing you to build apps for both iOS and Android with a single codebase. You will learn core concepts: component architecture, state management, navigation, native APIs (camera, location, notifications), and app store deployment. We cover Firebase for backend services, REST API integration, push notifications, and in-app purchases. Through hands-on projects, you will build real apps including e-commerce stores, social platforms, and productivity tools. By graduation, you will have published apps in your portfolio and the skills to launch your own startup or join leading tech companies as a mobile developer.'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/news/')
      .then(res => {
        const data = unwrapResults(res.data).filter(p => p.status === 'published');
        if (data.length > 0) {
          setPosts(data.map(p => ({
            id: p.id,
            title: p.title,
            author: p.author?.full_name || p.author?.username || 'Admin',
            date: p.created_at ? new Date(p.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            image: getMediaUrl(p.image) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
            excerpt: p.excerpt || p.content?.substring(0, 120) || '',
            content: p.content || p.excerpt || ''
          })));
        }
      })
      .catch(() => {});
  }, []);

  const displayPosts = posts || fallbackPosts;

  if (!displayPosts.length) return null;

  return (
    <div id="blog" className="relative w-full bg-black py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            From Our BLOG{' '}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm mt-3 max-w-xl mx-auto"
          >
            Insights, tutorials, and updates from the Elevate Skill team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-[10px] text-gray-300 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#15c8fb] transition-colors line-clamp-2">{post.title}</h3>
                <AnimatePresence mode="wait" initial={false}>
                  {expandedId === post.id ? (
                    <motion.p key="full" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-300 mb-3 leading-relaxed">{post.content}</motion.p>
                  ) : (
                    <motion.p key="excerpt" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-400 mb-3 line-clamp-3 leading-relaxed">{post.excerpt}</motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-[white] font-bold text-xs hover:gap-2 transition-all"
                >
                  {expandedId === post.id ? <>Show Less <ChevronUp size={12} /></> : <>Read More <ChevronRight size={12} /></>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-[#f8740f] to-[#fb6615] text-white font-black text-xs hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl">
            View All Articles <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
