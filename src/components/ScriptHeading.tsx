type Props = {
  className?: string;
};

export function ScriptHeading({ className, children }: Props & { children: string }) {
  return (
    <span className={["aol-script-heading", className].filter(Boolean).join(" ")}>
      <span>{children}</span>
      <svg
        className="aol-script-heading__line"
        viewBox="0 0 200 12"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          d="M2 8 C40 2, 60 10, 100 6 S160 2, 198 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
