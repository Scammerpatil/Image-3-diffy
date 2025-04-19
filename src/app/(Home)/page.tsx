import { IconCircleChevronRight } from "@tabler/icons-react";

export default function Home() {
  const homepageData = {
    hero: {
      title: "Generate Images from Sketch",
      subtitle:
        "Generate images from sketch with a single click. Use the power of AI to generate images from your sketches.",
      buttons: [
        { label: "Register Now", link: "#", primary: true },
        { label: "Learn More", link: "#", primary: false },
      ],
      image: "/ai.png",
    },
    sections: {
      about: {
        title: "About Us",
        content:
          "We are pioneers in turning your imagination into reality. Our AI generates images from your hand-drawn sketches using state-of-the-art models.",
      },
      features: {
        title: "Features",
        items: [
          "Sketch to Image Conversion",
          "Real-time AI Feedback",
          "Download and Share",
          "Privacy-Focused Processing",
        ],
      },
      contact: {
        title: "Contact Us",
        content:
          "Have questions or need support? Reach out to us and our team will respond within 24 hours.",
        email: "support@yourdomain.com",
      },
    },
  };
  const { hero, sections } = homepageData;
  return (
    <main className="bg-base-300 text-base-content">
      {/* Hero Section */}
      <section className="h-[calc(100vh-4.8rem)] flex items-center">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              {hero.title}
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              {hero.subtitle}
            </p>
            {hero.buttons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.link}
                className={`btn ${
                  btn.primary ? "btn-primary" : "btn-outline"
                } text-base font-medium text-center rounded-lg mr-4`}
              >
                {btn.label}
                {btn.primary && <IconCircleChevronRight />}
              </a>
            ))}
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src={hero.image} alt="Hero" />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 max-w-screen-xl mx-auto" id="about">
        <h2 className="text-3xl font-bold mb-4">{sections.about.title}</h2>
        <p className="text-lg text-base-content/80">{sections.about.content}</p>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 bg-base-200" id="features">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{sections.features.title}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.features.items.map((feature, index) => (
              <li
                key={index}
                className="p-4 bg-base-100 rounded-xl shadow text-base-content"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-12 max-w-screen-xl mx-auto" id="contact">
        <h2 className="text-3xl font-bold mb-4">{sections.contact.title}</h2>
        <p className="text-lg text-base-content/80 mb-2">
          {sections.contact.content}
        </p>
        <a
          href={`mailto:${sections.contact.email}`}
          className="text-primary underline"
        >
          {sections.contact.email}
        </a>
      </section>
    </main>
  );
}
