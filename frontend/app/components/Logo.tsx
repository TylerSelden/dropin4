import { CiChat1 } from "react-icons/ci";

export default function Logo() {
  return (
    <div className="flex justify-center gap-2 w-full">
      <CiChat1 className="text-violet-600 stroke-2 text-[2.6rem]" />
      <h1 className="bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 bg-clip-text text-transparent font-[helvetica] font-semibold text-4xl">DropIn</h1>
    </div>
  );
}
