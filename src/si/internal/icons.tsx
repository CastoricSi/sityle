// The few icons the components draw themselves, inlined so the package needs no
// icon library. Shapes from Lucide (https://lucide.dev, ISC License).

type IconProps = React.SVGProps<SVGSVGElement>;

function icon(name: string, shapes: React.ReactNode) {
	function Icon(props: IconProps) {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
				{shapes}
			</svg>
		);
	}
	Icon.displayName = name;
	return Icon;
}

export const Check = icon("Check", <path d="M20 6 9 17l-5-5" />);
export const ChevronRight = icon("ChevronRight", <path d="m9 18 6-6-6-6" />);
export const ChevronDown = icon("ChevronDown", <path d="m6 9 6 6 6-6" />);
export const Eye = icon(
	"Eye",
	<>
		<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
		<circle cx="12" cy="12" r="3" />
	</>,
);
export const EyeOff = icon(
	"EyeOff",
	<>
		<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
		<path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
		<path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
		<path d="m2 2 20 20" />
	</>,
);
export const Copy = icon(
	"Copy",
	<>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</>,
);
export const Search = icon(
	"Search",
	<>
		<path d="m21 21-4.34-4.34" />
		<circle cx="11" cy="11" r="8" />
	</>,
);
export const X = icon(
	"X",
	<>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</>,
);
