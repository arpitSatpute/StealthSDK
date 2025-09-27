import { useState, useCallback } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, GithubIcon } from "@/components/icons";
// import logo1 from "@/assets/logo1.png";

export const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [copied, setCopied] = useState(false);

  // Memoized address formatter
  const formatAddress = useCallback((addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" isBordered>
      {/* Brand + Nav Items */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
              <img
                src="./src/assets/logo11.png"
              width={76}
              alt="Logo"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/fallback-logo.svg";
              }}
            />
            <p className="font-bold text-inherit"></p>
          </Link>
        </NavbarBrand>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Desktop Right Section */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link
            isExternal
            // href={siteConfig.links.linkedin}
            aria-label="LinkedIn"
          >
            {/* <LinkedInIcon className="text-default-500" /> */}
          </Link>
          <Link isExternal href={siteConfig.links.github} aria-label="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        {/* Wallet Dropdown (Desktop) */}
        <NavbarItem className="hidden md:flex">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="text-sm font-normal bg-default-100"
                variant="flat"
                color={isConnected ? "success" : "default"}
              >
                {isConnected ? formatAddress(address!) : "Connect Wallet"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Wallet options">
              {isConnected ? (
                <DropdownSection title="Wallet">
                  <DropdownItem
                    key="full-address"
                    description={copied ? "Copied!" : "Click to copy"}
                    onClick={handleCopy}
                    className="truncate"
                  >
                    {address}
                  </DropdownItem>
                  <DropdownItem
                    key="disconnect"
                    className="text-danger"
                    color="danger"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </DropdownItem>
                </DropdownSection>
              ) : (
                <DropdownSection title="Connect with">
                  {connectors.map((connector) => (
                    <DropdownItem
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      isDisabled={!connector.id}
                    >
                      {connector.name}
                    </DropdownItem>
                  ))}
                </DropdownSection>
              )}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Right Section */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu Panel */}
      <NavbarMenu>
        {/* Links */}
        {siteConfig.navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link className="w-full" color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Social Links */}
        <NavbarMenuItem className="flex gap-4 mt-4">
          <Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link
            isExternal
            // href={siteConfig.links.linkedin}
            aria-label="LinkedIn"
          >
            {/* <LinkedInIcon className="text-default-500" /> */}
          </Link>
          <Link isExternal href={siteConfig.links.github} aria-label="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
        </NavbarMenuItem>

        {/* Wallet Button for Mobile */}
        <NavbarMenuItem className="mt-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="w-full text-sm font-normal bg-default-100"
                variant="flat"
                color={isConnected ? "success" : "default"}
              >
                {isConnected ? formatAddress(address!) : "Connect Wallet"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Wallet options">
              {isConnected ? (
                <DropdownSection title="Wallet">
                  <DropdownItem
                    key="full-address"
                    description={copied ? "Copied!" : "Click to copy"}
                    onClick={handleCopy}
                    className="truncate"
                  >
                    {address}
                  </DropdownItem>
                  <DropdownItem
                    key="disconnect"
                    className="text-danger"
                    color="danger"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </DropdownItem>
                </DropdownSection>
              ) : (
                <DropdownSection title="Connect with">
                  {connectors.map((connector) => (
                    <DropdownItem
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      isDisabled={!connector.id}
                    >
                      {connector.name}
                    </DropdownItem>
                  ))}
                </DropdownSection>
              )}
            </DropdownMenu>
          </Dropdown>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};