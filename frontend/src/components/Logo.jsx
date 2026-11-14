import { CiChat1 } from "react-icons/ci";

export default function Logo() {
	return (
		<div className="inline-flex gap-2">
			<CiChat1 className="text-violet-600 stroke-2 text-[2.6rem]" />
			<h1 className="bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 bg-clip-text text-transparent font-[helvetica] font-semibold text-4xl">
				DropIn
			</h1>
			<div className="relative top-4">
				<span className="bg-orange-700 text-sm font-bold px-2 py-0 rounded">
					Beta
				</span>
			</div>
		</div>
	);
}
