const typeRoles = [
  [
    "Homepage title",
    "Fluid, approximately 60–144px; weight 500; line height 0.95; letter spacing −0.045em",
  ],
  ["Brand page title", "60 / 72 / 96px; weight 500; compact line height"],
  [
    "Section headings",
    "Homepage About: 32–56px; brand sections: 30–36px; weight 500",
  ],
  ["Homepage subtitle", "22–26px; weight 400"],
  ["Body copy", "Primarily 16–20px; generous line spacing"],
  ["Interface and supporting text", "Primarily 12–18px, depending on role"],
  ["Code blocks", "12px with 24px line height; Space Mono 400"],
];

const fontLinkClassName =
  "inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

export function BrandTypography() {
  return (
    <section
      id="typography"
      tabIndex={-1}
      aria-labelledby="typography-heading"
      className="min-w-0 border-t border-foreground/15 py-12 focus:outline-none sm:py-16"
    >
      <h2
        id="typography-heading"
        className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl"
      >
        Typography
      </h2>
      <p className="mt-5 max-w-[65ch] text-base leading-7 text-foreground/75">
        Space Grotesk is Ethevex’s primary typeface. Space Mono is its technical
        companion, used for code, inline technical references, and filenames.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 border border-foreground/15 p-5 sm:p-8">
          <h3 className="text-lg font-medium">Space Grotesk — Primary</h3>
          <p className="mt-3 text-base leading-7 text-foreground/75">
            For titles, headings, body text, and interface labels.
          </p>
          <p className="mt-8 text-2xl leading-snug font-normal">
            A domain that encompasses all
          </p>
          <p className="mt-6 text-base leading-7 font-normal wrap-anywhere">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789
          </p>
          <div className="mt-6 space-y-2 text-base leading-7">
            <p className="font-normal">
              Regular 400 — A domain that encompasses all
            </p>
            <p className="font-medium">
              Medium 500 — A domain that encompasses all
            </p>
          </div>
          <a
            className={`mt-6 ${fontLinkClassName}`}
            href="https://github.com/floriankarsten/space-grotesk"
          >
            Space Grotesk source and downloads
          </a>
        </div>

        <div className="min-w-0 border border-foreground/15 p-5 sm:p-8">
          <h3 className="text-lg font-medium">Space Mono — Technical</h3>
          <p className="mt-3 text-base leading-7 text-foreground/75">
            For code, inline technical references, and filenames.
          </p>
          <div className="mt-8 font-mono text-base leading-7 font-normal wrap-anywhere">
            <p>Regular 400</p>
            <pre className="mt-6 whitespace-pre-wrap">
              <code>{'const brand = "Ethevex";'}</code>
            </pre>
            <p className="mt-6">{"0 O 1 I l {} [] () =>"}</p>
            <p className="mt-6">ethevex-attribution.tsx</p>
          </div>
          <a
            className={`mt-6 ${fontLinkClassName}`}
            href="https://github.com/googlefonts/spacemono"
          >
            Space Mono source and downloads
          </a>
        </div>
      </div>

      <div className="mt-12">
        <h3 id="typography-reference-heading" className="text-lg font-medium">
          Current type styles
        </h3>
        <p
          id="typography-reference-description"
          className="mt-3 max-w-[65ch] text-base leading-7 text-foreground/75"
        >
          These roles document different contexts across the website, rather
          than prescribe one universal heading size. Pixel equivalents assume
          the default 16px root size.
        </p>
        <div
          role="region"
          aria-labelledby="typography-reference-heading"
          aria-describedby="typography-reference-description"
          tabIndex={0}
          className="mt-6 max-w-full overflow-x-auto border border-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <table className="w-full min-w-xl text-left text-sm leading-6">
            <caption className="sr-only">
              Existing Ethevex typography by role
            </caption>
            <thead className="border-b border-foreground/15 bg-muted">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Role
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Current treatment
                </th>
              </tr>
            </thead>
            <tbody>
              {typeRoles.map(([role, treatment]) => (
                <tr
                  key={role}
                  className="border-b border-foreground/15 last:border-b-0"
                >
                  <th
                    scope="row"
                    className="w-1/3 px-5 py-4 align-top font-medium"
                  >
                    {role}
                  </th>
                  <td className="px-5 py-4 align-top text-foreground/75">
                    {treatment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 max-w-[65ch]">
        <h3 className="text-lg font-medium">Using the typefaces</h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-foreground/75">
          <li>
            Use Space Grotesk 400 for reading text and 500 for emphasis and
            headings.
          </li>
          <li>
            Reserve tight negative letter spacing for larger headings. Keep
            normal spacing for body text and code.
          </li>
          <li>
            Use Space Mono 400 for technical content, without applying it to
            navigation or ordinary prose.
          </li>
          <li>
            Affiliated projects may retain their own typography. The attribution
            component inherits its host’s font and loads neither typeface.
          </li>
        </ul>
        <p className="mt-5 text-sm leading-6 text-foreground/65">
          These specimens cover Latin text; they do not demonstrate universal
          script coverage. Both typefaces are independently created fonts. Use
          their official sources above for font information and downloads.
        </p>
      </div>
    </section>
  );
}
