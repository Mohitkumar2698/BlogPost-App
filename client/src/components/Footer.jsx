import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-5 md:px-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} DevPost. Built for creators and communities.
        </div>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-100"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-100"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
