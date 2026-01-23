export default function ContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="container p-5 bg-gray-800 rounded-lg drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] w-full sm:max-w-md">{children}</div>
    </div>
  );
}
