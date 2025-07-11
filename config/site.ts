export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Messenger App",
  description: "A modern real-time messaging application with friends and group chat functionality.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Chats",
      href: "/chats",
    },
    {
      label: "Friends",
      href: "/friends",
    },
    {
      label: "Groups",
      href: "/groups",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Messages",
      href: "/messages",
    },
    {
      label: "Friends",
      href: "/friends",
    },
    {
      label: "Groups",
      href: "/groups",
    },
    {
      label: "Notifications",
      href: "/notifications",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Support",
      href: "/help-support",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/messenger-app/messenger",
    twitter: "https://twitter.com/messenger_app",
    docs: "https://messenger-app.com/docs",
    discord: "https://discord.gg/messenger-app",
    support: "https://messenger-app.com/support",
    privacy: "https://messenger-app.com/privacy",
    terms: "https://messenger-app.com/terms",
  },
}
