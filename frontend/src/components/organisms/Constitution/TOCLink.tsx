import { customPalette } from "@/constants";
import { Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props {
  href: string;
  children: React.ReactNode;
  callback: () => void;
}

/**
 * TOCLink Component
 *
 * This component represents a link in a Table of Contents (TOC) that scrolls smoothly to the
 * corresponding section on the page when clicked. The link highlights itself when active
 * and resets other links.
 *
 * @param {string} props.href - The hash URL that the link points to (e.g., "#section1").
 * @param {React.ReactNode} props.children - The content inside the link (e.g., link text).
 * @param {Function} props.callback - A callback function to be executed after the link is clicked.
 */

const TOCLink = ({ href, children, callback }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Extract the target ID from href (e.g., "#section1" => "section1")
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      // Add a timeout to ensure the scroll happens after the DOM is fully ready
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href); // Update browser URL
        window.dispatchEvent(
          new CustomEvent("toc-link-click", { detail: href })
        ); // Reset other links
        setIsActive(true);
      }, 100); // Timeout of 100ms or adjust as needed
    }

    callback();
  };

  useEffect(() => {
    const handleTocLinkClick = (event: CustomEvent) => {
      if (event.detail !== href) {
        setIsActive(false); // Reset the active state if another link is clicked
      }
    };

    window.addEventListener(
      "toc-link-click",
      handleTocLinkClick as EventListener
    );

    return () => {
      window.removeEventListener(
        "toc-link-click",
        handleTocLinkClick as EventListener
      );
    };
  }, [href]);

  useEffect(() => {
    if (linkRef.current) {
      setIsTruncated(linkRef.current.scrollWidth > linkRef.current.clientWidth);
    }
  }, [children]);

  return (
    <Tooltip
      title={isTruncated ? children : ""}
      arrow
      enterDelay={200}
      enterNextDelay={200}
      leaveDelay={0}
    >
      <a
        ref={linkRef}
        href={href}
        onClick={handleClick}
        style={{
          color: customPalette.textBlack,
          textDecoration: "none",
          maxWidth: "292px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          backgroundColor: isActive ? customPalette.accordionBg : undefined,
          borderRadius: "30px",
          padding: "0 8px",
          boxSizing: "border-box"
        }}
      >
        {children}
      </a>
    </Tooltip>
  );
};

export default TOCLink;
