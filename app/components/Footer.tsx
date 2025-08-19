import React from "react";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerData: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Pricing", href: "/support/pricing" },
      { label: "Images Generation", href: "/home" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-of-service" },
      { label: "Blog", href: "https://blog.reroom.ai/" },
    ],
  },
  {
    title: "AI Tools",
    links: [
      { label: "Style Reference", href: "/service/style" },
      { label: "Sketch to Image", href: "/service/sketch" },
    ],
  },
  {
    title: "Contact",
    links: [{ label: "Contact Us", href: "mailto:feedback@reroom.ai" }],
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:flex-row sm:justify-between sm:px-10">
        {/* Loop through footer sections */}
        {footerData.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">
              {section.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-gray-100 px-6 py-4 text-center text-sm text-gray-500 sm:px-10 sm:text-left">
        2025 © ReRoom AI by Stylefie, Inc.
      </div>
    </footer>
  );
};

export default Footer;
