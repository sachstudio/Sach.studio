function Star() {
  return (
    <svg aria-hidden viewBox="0 0 50 50" className="mx-8 size-9 shrink-0 text-blue-500 sm:mx-12 sm:size-16">
      <path
        d="M25 0C25 13.8 36.2 25 50 25 36.2 25 25 36.2 25 50 25 36.2 13.8 25 0 25 13.8 25 25 13.8 25 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Phrase() {
  return (
    <span className="flex shrink-0 items-center whitespace-nowrap font-serif text-[44px] uppercase leading-none text-blue-500 sm:text-[72px]">
      <span>Let&apos;s&nbsp;</span>
      <em>work together</em>
      <Star />
    </span>
  );
}

export function Marquee() {
  return (
    <div aria-hidden className="overflow-hidden py-10 sm:py-14">
      {/* Documented exception to the duration tokens: a slow, linear ticker taken from the design. */}
      <div className="motion-ticker flex w-max animate-[marquee_28s_linear_infinite] motion-reduce:animate-none">
        <Phrase />
        <Phrase />
        <Phrase />
        <Phrase />
      </div>
    </div>
  );
}
