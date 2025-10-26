"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

const MOBILE_BREAKPOINT = 1000;

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const navLinks: NavLink[] = [
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/contact", label: "Contact", external: true },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [collapseHeight, setCollapseHeight] = useState(0);
  const collapseInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    setIsOpen(false);
  }, [pathname, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const inner = collapseInnerRef.current;
    if (!inner) return;

    const updateHeight = () => {
      setCollapseHeight(inner.offsetHeight);
    };

    // Keep the animated height in sync with wrapped items.
    updateHeight();

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateHeight);
      observer.observe(inner);
    }

    window.addEventListener("resize", updateHeight);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isMobile, isOpen, pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const collapseStyle = isMobile
    ? {
        height: isOpen ? collapseHeight : 0,
        opacity: isOpen ? 1 : 0,
      }
    : undefined;

  const mobileNavId = "navbar-mobile-links";

  return (
    <nav className={styles.navbar}>
      <div className={styles.topRow}>
        <Link
          href="/"
          className={cx(styles.navbarTitle, isActive("/") && styles.active)}
          aria-current={isActive("/") ? "page" : undefined}
        >
          Adon Omeri
        </Link>
        <ul className={cx(styles.navList, styles.desktopNav)}>
          {navLinks.map((item) => {
            const active = isActive(item.href);
            const className = cx(styles.link, active && styles.active);
            const ariaCurrent = active ? "page" : undefined;

            return (
              <li key={`desktop-${item.href}`}>
                {item.external ? (
                  <a
                    href={item.href}
                    className={className}
                    aria-current={ariaCurrent}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={className}
                    aria-current={ariaCurrent}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={mobileNavId}
          aria-label="Toggle navigation"
          data-open={isOpen}
        >
          <span className={styles.toggleLabelClosed} aria-hidden="true">
            ...
          </span>
          <span className={styles.toggleLabelOpen} aria-hidden="true">
            ×
          </span>
        </button>
      </div>
      <div
        id={mobileNavId}
        className={styles.collapseWrapper}
        style={collapseStyle}
        aria-hidden={isMobile ? !isOpen : true}
      >
        <div ref={collapseInnerRef} className={styles.collapseInner}>
          <ul className={cx(styles.navList, styles.mobileNavList)}>
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const className = cx(styles.link, active && styles.active);
              const ariaCurrent = active ? "page" : undefined;

              return (
                <li key={`mobile-${item.href}`}>
                  {item.external ? (
                    <a
                      href={item.href}
                      className={className}
                      aria-current={ariaCurrent}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={className}
                      aria-current={ariaCurrent}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
