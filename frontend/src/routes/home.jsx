import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../components/ContentContainer";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import { CiChat1 } from "react-icons/ci";
import { PiLightning } from "react-icons/pi";
import { GoLock } from "react-icons/go";
import { FiEyeOff } from "react-icons/fi";

import { Schemas, Validate } from "../../../shared/schemas";
import { UseSocket } from "../components/SocketContext";

export default function Home() {
  const usernameRef = useRef();
  const roomRef = useRef();
  const nav = useNavigate();
  const [usernameErr, setUsernameErr] = useState();
  const [roomErr, setRoomErr] = useState();
  const { socket } = UseSocket();

  const [prevRooms, setPrevRooms] = useState(() => {
    return JSON.parse(localStorage.getItem("dropin-prevRooms") || "[]");
  });
  const [roomIndex, setRoomIndex] = useState(0);
  const [prevUsernames, setPrevUsernames] = useState(() => {
    return JSON.parse(localStorage.getItem("dropin-prevUsernames") || "[]");
  });
  const [usernameIndex, setUsernameIndex] = useState(0);

  const join = () => {
    const errs = [
      Validate(Schemas.name, "Username", usernameRef.current.value),
      Validate(Schemas.name, "Room Code", roomRef.current.value)
    ];
    setUsernameErr(errs[0]);
    setRoomErr(errs[1]);

    if (errs[0] || errs[1]) return;

    if (!prevRooms.includes(roomRef.current.value)) {
      const newRooms = [roomRef.current.value, ...prevRooms].slice(0, 32);
      setPrevRooms(newRooms);
      localStorage.setItem("dropin-prevRooms", JSON.stringify(newRooms));
    }
    if (!prevUsernames.includes(usernameRef.current.value)) {
      const newUsernames = [usernameRef.current.value, ...prevUsernames].slice(0, 32);
      setPrevUsernames(newUsernames);
      localStorage.setItem("dropin-prevUsernames", JSON.stringify(newUsernames));
    }

    socket.emit("subscribe", {
      room: roomRef.current.value,
      username: usernameRef.current.value
    }, () => {
      nav("/chat");
    });
  };

  const keyDown = (evt) => {
    const arr = evt.target.id === "username" ? prevUsernames : prevRooms;
    const index = evt.target.id === "username" ? usernameIndex : roomIndex;
    const setIndex = evt.target.id === "username" ? setUsernameIndex : setRoomIndex;

    if (evt.key === "ArrowDown" || evt.key === "ArrowUp" || evt.key === "Enter") evt.preventDefault();

    if (evt.key === "ArrowDown" && index > 0) {
      evt.target.value = arr[index - 1];
      setIndex(index - 1);
      evt.target.value = arr[index - 1];
    } else if (evt.key === "ArrowUp" && index < arr.length - 1) {
      evt.target.value = arr[index + 1];
      setIndex(index + 1);
      evt.target.value = arr[index + 1];
    } else if (evt.key === "Enter") {
      join();
    }
  }

  return (
    <ContentContainer>
      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="mt-8">
        <TextInput
          label="Username"
          id="username"
          placeholder="Your display name"
          defaultValue={ prevUsernames[usernameIndex] || "" }
          inputRef={ usernameRef }
          onKeyDown={ keyDown }
          err={ usernameErr }
        />
        <TextInput
          label="Room Code"
          id="room"
          placeholder="Enter room code"
          defaultValue={ prevRooms[roomIndex] || "" }
          inputRef={ roomRef }
          onKeyDown={ keyDown }
          err={ roomErr }
        />
        <p className="ml-1 mt-1 text-sm text-gray-500">
          Add <span className="bg-gray-700 px-1 rounded">!</span> prefix for non-persistent rooms
        </p>
        <button
          className="w-full font-semibold text-lg mt-6 bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 active:bg-violet-900 transition-colors cursor-pointer"
          onClick={ join }>
          Join
        </button>
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
        &copy; { new Date().getFullYear() } DropIn Chat. All rights reserved.
      </footer>
    </ContentContainer>
  );
}
