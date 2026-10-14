const About = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full py-16 text-left lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="mb-6 h-3 w-16 bg-foreground [clip-path:polygon(0_0,100%_0,calc(100%_-_12px)_100%,0_100%)]"
      />
      <h2
        id="about-heading"
        className="text-[clamp(2rem,4vw,3.5rem)] leading-tight font-medium tracking-[-0.04em]"
      >
        What is Ethevex
      </h2>
      <p className="mt-8 max-w-[62ch] text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
        Ethevex is an independent software initiative focused on building
        developer tools, applications, and open-source projects. Driven by
        curiosity, experimentation, and a commitment to thoughtful engineering.
      </p>
    </section>
  );
};

export default About;
