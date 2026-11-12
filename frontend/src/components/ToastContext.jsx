import { createContext, useContext, useState, useEffect } from "react";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { RiCloseFill } from "react-icons/ri";

const toastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = crypto.randomUUID();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
  };
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  return (
    <toastContext.Provider value={{ toasts, addToast, removeToast }}>
      { children }
      <ToastContainer />
    </toastContext.Provider>
  );
}

export function UseToast() {
  return useContext(toastContext);
}

const toastStyles = {
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-black",
};
const toastIcons = {
  error: <MdErrorOutline className="shrink-0" size={20} />,
  info: <MdInfoOutline className="shrink-0" size={20} />,
  warning: <IoWarningOutline className="shrink-0" size={20} />
};
function Toast({ id, type, message }) {
  const { removeToast } = useContext(toastContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const timer = setTimeout(() => {
      handleClose();
    }, 7000);
    
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    }
  }, []);
  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  return (
    <div className={`
      flex items-center gap-3 m-3 mb-0 p-4 rounded shadow transition-all duration-300 ease-out
      ${ toastStyles[type] }
      ${ isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0" }
    `}>
      {toastIcons[type]}
      <span className="text-md break-all">{ message }</span>
      <button className={`ml-auto p-1 rounded hover:opacity-60 ${ toastStyles[type] }`} onClick={ handleClose }>
        <RiCloseFill size={ 20 } />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useContext(toastContext);

  return (
    <div className="fixed w-full min-[480px]:w-120 top-0 right-0 flex flex-col z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} type={toast.type} message={toast.message} />
      ))}
    </div>
  );
}
