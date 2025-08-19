const privacySections = [
  {
    title: "Introduction",
    content: `Stylefie, Inc. ("us", "we", or "our") operates the ReRoom website (https://reroom.ai) (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.

We use your personal information only for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms of Service.`,
  },
  {
    title: "Information Collection and Use",
    content: `While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, email address, and phone number ("Personal Information").

We collect this information for the purpose of providing the Service, identifying and communicating with you, responding to your requests and inquiries, and improving our services.`,
  },
  {
    title: "Log Data",
    content: `We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

In addition, we may use third-party services, such as Google Analytics, that collect, monitor, and analyze this type of information to enhance the functionality of our Service. These third-party service providers have their own privacy policies addressing how they use such information.`,
  },
  {
    title: "Cookies",
    content: `Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive. We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.`,
  },
  {
    title: "Service Providers",
    content: `We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.`,
  },
  {
    title: "Security",
    content: `The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.`,
  },
  {
    title: "Links to Other Sites",
    content: `Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.`,
  },
  {
    title: "Children's Privacy",
    content: `Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you learn that your Children have provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from a child under age 13 without verification of parental consent, we take steps to remove that information from our servers.`,
  },
  {
    title: "Changes to This Privacy Policy",
    content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy, please contact us by email at feedback@reroom.ai.`,
  },
];

export default function page() {
  return (
    <div className="mx-auto mt-20 w-[60vw] p-6 text-gray-800">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: April 22, 2023</p>

      {privacySections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="mb-2 mt-12 text-xl font-semibold">{section.title}</h2>
          <p className="whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
