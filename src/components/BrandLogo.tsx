type Props = {
  className?: string;
};

export function BrandLogo({ className }: Props) {
  return (
    <img
      className={["aol-brand-mark", className].filter(Boolean).join(" ")}
      src="./brand/aol-logo.png"
      alt="Искусство Жизни"
      width={180}
      height={48}
      decoding="async"
    />
  );
}
