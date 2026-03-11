import React from 'react';

const Footer = () => {
  return (
    <footer className="glass border-t border-cyber-blue/30 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-cyber-blue text-sm font-bold tracking-widest uppercase mb-1">
            © 2026 SafeNet AI
          </p>
          <p className="text-gray-500 text-xs italic">
            Next-Gen Cybersecurity Powered by Artificial Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;