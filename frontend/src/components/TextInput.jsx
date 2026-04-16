export default function TextInput({ label, id, placeholder, defaultValue, inputRef, onKeyDown, err }) {
  return (
    <>
      <label htmlFor={ id } className="ml-1 mt-4 block">{ label }</label>
      <input
        type="text"
        placeholder={ placeholder }
        defaultValue={ defaultValue }
        id={ id }
        ref={ inputRef }
        onKeyDown={ onKeyDown }
        className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-1 ${err ? "border-red-600 focus:ring-red-600" : "border-gray-600 focus:ring-violet-600"}`}
      />
      <p className="text-sm text-red-500 peer-invalid:block ml-1 mt-1">{ err }</p>
    </>
  );
}
