import { orange } from "@/constants";
import { useEffect, useState } from "react";

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

  const handleClick = (e) => {
    e.preventDefault();
    // Extract the target element's ID from the href (e.g., "#section1" => "section1")
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, null, href);

      // Dispatch a custom event to notify other TOC links to reset their active state
      window.dispatchEvent(new CustomEvent("toc-link-click", { detail: href }));

      setIsActive(true);
    }
    callback();
  };

  /**
   * Listens for the custom "toc-link-click" event and resets this link's active state
   * if the clicked link's href does not match this link's href.
   */
  useEffect(() => {
    const handleTocLinkClick = (event) => {
      if (event.detail !== href) {
        setIsActive(false); // Reset the active state if another link is clicked
      }
    };

    window.addEventListener("toc-link-click", handleTocLinkClick);

    return () => {
      window.removeEventListener("toc-link-click", handleTocLinkClick);
    };
  }, [href]);

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{ color: isActive ? orange.c500 : "inherit" }}
    >
      {children}
    </a>
  );
};

export default TOCLink;
