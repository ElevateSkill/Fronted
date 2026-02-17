import Landing from "./Landing";
import Services from "./Service";
import Stories from "./Stories";
import FAQ from "./FAQ";
import Contact from "./Contact";

export default function MainView() {
  return (
    <>
      <section id="home"><Landing /></section>
      <section id="services"><Services /></section>
      <section id="stories"><Stories /></section>
      <section id="faq"><FAQ /></section>
      <section id="contact"><Contact /></section>

    </>
  );
}