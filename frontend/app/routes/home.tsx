import type { Route } from "./+types/home";
import ContentContainer from "../components/ContentContainer.tsx";
import { CiChat1 } from "react-icons/ci";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DropIn Chat" },
    { name: "description", content: "DropIn is a simple, web-based chat app" },
  ];
}

export default function Home() {
  return (
    <ContentContainer>
      <div className="flex justify-center gap-2">
        <CiChat1 className="text-violet-600 stroke-[2] text-[2.6rem]" />
        <h1 className="bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 bg-clip-text text-transparent font-[helvetica] font-semibold text-4xl">DropIn</h1>
      </div>
    </ContentContainer>
  );
}
