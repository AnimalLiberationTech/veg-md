type PhotoCreditProps = {
  creditLabel: string;
  creditHref: string;
  className?: string;
};

const PhotoCredit = ({creditLabel, creditHref, className}: PhotoCreditProps) => {
  const creditClassName = className ?? "absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] italic text-white/90 hover:underline";

  return (
    <a
      href={creditHref}
      target="_blank"
      rel="noopener noreferrer"
      className={creditClassName}
    >
      {creditLabel}
    </a>
  );
};

export default PhotoCredit;

