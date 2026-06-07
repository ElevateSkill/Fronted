import React from 'react';
import AnnouncementTicker from '../components/AnnouncementTicker';
import Landing from './Landing';
import Services from './Service';
import Testimonals from './Testimonals';
import FAQ from './FAQ';
import Contact from './Contact';
import Courses from './Courses';
import Blog from './Blog';
import Stories from './Stories';

export default function MainView() {
  return (
    <>
      {/* Top animated announcement ticker — fetches from real backend */}
      <AnnouncementTicker variant="marquee" />

      <section id="home"><Landing /></section>
      <section id="services"><Services /></section>
      <section id="courses"><Courses /></section>
      <Stories />
      <Testimonals />
      <section id="blog"><Blog /></section>
      <section id="faq"><FAQ /></section>
      <section id="contact"><Contact /></section>
    </>
  );
}
