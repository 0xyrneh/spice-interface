// import MediumIcon from 'assets/images/medium.svg';
// import GithubIcon from 'assets/images/github.svg';
// import DiscordIcon from 'assets/images/discord.svg';
// import TwitterIcon from 'assets/images/twitter.svg';
// import DuneIcon from 'assets/images/dune.svg';

export interface RouteType {
  key: string;
  text: string;
  url: string;
  isComingSoon: boolean;
}

export interface SocialMediaType {
  key: string;
  text: string;
  url: string;
  icon: string;
  isComingSoon: boolean;
}

export const routes: RouteType[] = [
  // { key: 'dashboard', text: 'Dashboard', url: '/dashboard', isComingSoon: false },
  { key: "vaults", text: "Vaults", url: "/vaults", isComingSoon: false },
  {
    key: "leaderboard",
    text: "Leaderboard",
    url: "/leaderboard",
    isComingSoon: false,
  },
  { key: "leverage", text: "Leverage", url: "/leverage", isComingSoon: false },
];

// export const socialMedias: SocialMediaType[] = [
//   { key: 'docs', icon: MediumIcon, isComingSoon: false, text: 'Docs', url: 'https://docs.spicefi.xyz/' },
//   { key: 'twitter', icon: TwitterIcon, isComingSoon: false, text: 'Twitter', url: 'https://twitter.com/spice_finance' },
//   {
//     key: 'discord',
//     icon: DiscordIcon,
//     isComingSoon: false,
//     text: 'Discord',
//     url: 'https://discord.com/invite/spicefinance',
//   },
//   // { key: 'dune', icon: DuneIcon, isComingSoon: true, text: 'Dune', url: 'https://dune.com/' },
//   { key: 'github', icon: GithubIcon, isComingSoon: false, text: 'Github', url: 'https://github.com/teamspice' },
// ];
