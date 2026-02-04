import ContentContainer from "../components/ContentContainer";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import { CiChat1 } from "react-icons/ci";
import { PiLightning } from "react-icons/pi";
import { GoLock } from "react-icons/go";
import { FiEyeOff } from "react-icons/fi";

export default function Home() {
  return (
    <ContentContainer>
      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="mt-8">
        <TextInput label="Room Code" id="test" placeholder="Enter room code" />
        <TextInput label="Username" id="username" placeholder="Your display name" />
        <p className="ml-1 mt-1 text-sm text-gray-500">
          Add <span className="bg-gray-700 px-1 rounded">!</span> prefix for non-persistent rooms
        </p>
        <button className="w-full font-semibold text-lg mt-6 bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 transition-colors">Join</button>
      </div>

      <hr className="my-8 border-gray-600" />
      <h3 className="font-semibold mb-3">How it works:</h3>

      <div className="text-gray-300">
        <p className="mb-3 flex items-center">
          <PiLightning className="inline text-red-500 text-lg mr-2" />
          Enter a room code and username to start chatting
        </p>
        <p className="mb-3 flex items-center">
          <GoLock className="inline text-red-500 text-lg mr-2" />
          All messages are encrypted for your privacy
        </p>
        <p className="mb-3 flex items-center">
          <FiEyeOff className="inline text-red-500 text-lg mr-2" />
          Non-persistent rooms do not save any messages
        </p>
      </div>

      <footer className="mt-8 text-gray-500 text-sm text-center">
        <hr className="mb-4 border-gray-600" />
        &copy; {new Date().getFullYear()} DropIn Chat. All rights reserved.
      </footer>
    </ContentContainer>
  );
}
