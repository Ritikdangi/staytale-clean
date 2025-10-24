import aboutImg from "../assets/images/about_img.png";
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import "./styles/About.css";

const About = () => {
  return (
    <section className="w-full flex justify-center about-bg px-4 py-12">
      <div className="w-full max-w-3xl bg-white/5 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10 relative z-10">
        <h1 className="text-3xl md:text-4xl text-center font-bold mb-6">About</h1>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={aboutImg}
              alt="Profile"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover shadow-md border-2 border-white/10"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-semibold">Ritik Dangi</h2>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
              <a
                href="https://github.com/Ritikdangi"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="GitHub"
              >
                <FaGithub />
                <span className="hidden sm:inline">GitHub</span>
                <FaExternalLinkAlt className="ml-2 text-xs" />
              </a>

              <a
                href="https://www.linkedin.com/in/ritik-dangi-8a1729171"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
                <span className="hidden sm:inline">LinkedIn</span>
                <FaExternalLinkAlt className="ml-2 text-xs" />
              </a>
            </div>

            <p className="mt-4 text-base leading-relaxed text-neutral-200 max-w-xl mx-auto md:mx-0">
              Passionate about crafting delightful travel experiences and building
              polished web products. I combine an eye for design with practical
              engineering to create interfaces that travelers trust — clean,
              accessible, and focused on the journey. When I'm not coding, you'll
              find me planning the next getaway or exploring local hidden gems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
