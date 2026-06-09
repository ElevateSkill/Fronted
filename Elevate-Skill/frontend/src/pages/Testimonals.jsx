import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

import dr_yadessa from '../assets/people/dr-yadessa.png'
import elevate01 from '../assets/people/elevate-student01.jpg'
import elevate02 from '../assets/people/elevate-graduate.jpg'

import elevate_staff from '../assets/people/elevate-staff.jpg'
import prof_melaku from '../assets/people/prof-melaku.jpg'
import partnership from '../assets/people/partnership.jpg'

const testimonials = [
	{
		name: 'Amanuel Bekele',
		role: 'UI/UX Designer',
		company: 'Creative Flow Studio',
		quote: 'The learning path felt practical from day one. I stopped collecting random tutorials and started building real portfolio work that changed how clients saw me.',
		image: elevate01,
		score: 5,
		outcome: 'Got hired within 6 weeks'
	},
	{
		name: 'Hana Getachew',
		role: 'Digital Marketing',
		company: 'BrightStack Labs',
		quote: 'The mentorship was the biggest difference. Every project was reviewed like a real product, and that made my code, design sense, and confidence level up fast.',
		image: elevate02,
		score: 5,
		outcome: 'Built 4 client projects'
	},
	{
		name: 'Mr. Bereket Matiwos',
		role: 'Founder & CEO',
		company: 'Alpha Technology Solution',
		quote: 'This did not feel like a generic course. The structure, the feedback, and the results-oriented lessons made it easy to stay focused and actually finish strong.',
		image: partnership,
		score: 5,
		outcome: 'Raised income by 2x'
	}
];

const testimonials2 = [
	{
		name: 'Alemshet Kebede',
		role: 'Social Management',
		company: 'Elevateve Skill',
		quote: 'At first, I was skeptical about online learning, but the personalized feedback and real-world projects made all the difference. I landed a job within weeks of finishing the program. By help of Elevate Skill, I was able to transition into a new career and triple my income in less than a year.',
		image: elevate_staff,
		score: 5,
		outcome: 'Got hired within 6 weeks'
	},
	{
		name: 'Prof. Melaku Tadesse',
		role: 'Academic Advisor',
		company: 'ASTU University',
		quote: 'Elevate Skill’s mentorship was the biggest difference. Every project was reviewed like a real product, and that made my code, design sense, and confidence level up fast.',
		image: prof_melaku,
		score: 5,
		outcome: 'Built 4 client projects'
	},
	{
		name: 'Dr Yadessa Melaku',
		role: 'Vice President',
		company: 'ASTU, Adama',
		quote: 'This did not feel like a generic course. The structure, the feedback, and the results-oriented lessons made it easy to stay focused and actually finish strong.',
		image: dr_yadessa,
		score: 5,
		outcome: 'Raised income by 2x'
	}
];

const highlights = [
	'24,000+ learners supported',
	'1:1 project feedback',
	'Portfolio-first learning',
	'Career-ready outcomes'
];

export default function Testimonals() {
	return (
		<section id="testimonals" className="relative overflow-hidden bg-[#050816] py-20 md:py-28 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(21,200,251,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(248,159,41,0.16),transparent_28%)]" />
			<div className="absolute top-24 left-6 w-64 h-64 bg-[#15c8fb]/10 blur-3xl" />
			<div className="absolute bottom-8 right-10 w-72 h-72 bg-[#f89f29]/10 blur-3xl" />

			<div className="relative z-10 mx-auto max-w-7xl px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
				>
					<div className="max-w-3xl">
						{/* <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#f89f29] backdrop-blur-sm">
							Testimonials
						</div> */}
						<h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
							Real stories from people who kept going.
						</h2>
						<p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/70">
							Use this section with mock images for now. It is built to feel premium, animated, and easy to swap with final student photos later.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
						{highlights.map((item) => (
							<div key={item} className="border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
								{item}
							</div>
						))}
					</div>
				</motion.div>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="relative overflow-hidden border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/10 via-transparent to-[#f89f29]/10" />
						<div className="relative grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
							<div className="relative overflow-hidden border border-white/10 bg-black/30 min-h-[360px]">
								<img
									src={testimonials[0].image}
									alt={testimonials[0].name}
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
								{/* <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
									<CheckCircle2 size={13} className="text-[#15c8fb]" />
									Verified result
								</div> */}
								<div className="absolute bottom-5 left-5 right-5">
									{/* <div className="mb-3 flex items-center gap-1">
										{[...Array(testimonials[0].score)].map((_, index) => (
											<Star key={index} size={14} className="fill-[#f89f29] text-[#f89f29]" />
										))}
									</div> */}
									<p className="text-lg font-black tracking-tight">{testimonials[0].name}</p>
									<p className="text-sm text-white/70">{testimonials[0].role} · {testimonials[0].company}</p>
									{/* <div className="mt-3 inline-flex rounded-full border border-[#15c8fb]/30 bg-[#15c8fb]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#15c8fb]">
										{testimonials[0].outcome}
									</div> */}
								</div>
							</div>

							<div className="flex flex-col justify-between gap-5">
								<div>
									<Quote size={34} className="text-[#f89f29]/70" />
									<p className="mt-4 text-lg md:text-xl leading-relaxed text-white/85">
										{testimonials[0].quote}
									</p>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									{testimonials.slice(1).map((item) => (
										<div key={item.name} className="border border-white/10 bg-white/5 p-4">
											<div className="flex items-center gap-3">
												<img
													src={item.image}
													alt={item.name}
													className="h-14 w-14 object-cover ring-2 ring-white/10"
												/>
												<div>
													<p className="font-black">{item.name}</p>
													<p className="text-xs text-white/60">{item.role}</p>
												</div>
											</div>
											{/* <div className="mt-3 flex items-center gap-1">
												{[...Array(item.score)].map((_, index) => (
													<Star key={index} size={12} className="fill-[#f89f29] text-[#f89f29]" />
												))}
											</div> */}
											<p className="mt-3 text-sm leading-relaxed text-white/70">{item.quote}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="grid gap-6"
					>
						{testimonials2.map((item, index) => (
							<motion.article
								key={item.name}
								initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.45, delay: index * 0.08 }}
								className="group border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
							>
								<div className="flex items-start gap-4">
									<img
										src={item.image}
										alt={item.name}
										className="h-16 w-16 object-cover ring-2 ring-white/10"
									/>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<h3 className="text-lg font-black tracking-tight text-white">{item.name}</h3>
											{/* <span className="rounded-full border border-[#15c8fb]/30 bg-[#15c8fb]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#15c8fb]">
												{item.outcome}
											</span> */}
										</div>
										<p className="mt-1 text-sm font-medium text-white/65">
											{item.role} · {item.company}
										</p>
									</div>
								</div>

								{/* <div className="mt-4 flex items-center gap-1">
									{[...Array(item.score)].map((_, starIndex) => (
										<Star key={starIndex} size={12} className="fill-[#f89f29] text-[#f89f29]" />
									))}
								</div> */}

								<p className="mt-4 text-sm leading-relaxed text-white/75">
									{item.quote}
								</p>
							</motion.article>
						))}

						<div className="border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 backdrop-blur-xl">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f89f29]">Next step</p>
									<h3 className="mt-2 text-2xl font-black tracking-tight text-white">Replace mock images with real learner photos later.</h3>
								</div>
								<button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[red] to-[#ff9d00] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#15c8fb]/20 transition-transform hover:scale-[1.02]">
									Add real media
									<ArrowRight size={16} />
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
