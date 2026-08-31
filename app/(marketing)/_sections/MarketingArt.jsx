import Image from "next/image";

// Home hero artwork. This used to be a hand-drawn inline SVG; it's now the
// designed hero.png, which carries an alpha channel — so the drop-shadow in
// .ln-art hugs the illustration instead of outlining a rectangle.
//
// `priority` because this is the largest element above the fold: without it
// Next lazy-loads the hero and the page visibly pops in.
export default function MarketingArt() {
  return (
    <div className="ln-art-wrap" aria-hidden="true">
      {/* `sizes` MUST match the width .ln-art actually renders at (820px on
          desktop). Understate it and Next serves a narrower file that the
          browser then stretches — which looks exactly like a blurry, "fatti
          hui" image. */}
      <Image
        src="/hero.png"
        alt=""
        className="ln-art"
        width={1536}
        height={1024}
        priority
        quality={95}
        sizes="(max-width: 980px) 100vw, 820px"
      />
    </div>
  );
}
