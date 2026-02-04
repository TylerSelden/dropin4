export default function TextInput({ label, id, placeholder }) {
  return (
    <>
      <label htmlFor={ id } className="ml-1 mt-4 block">{ label }</label>
      <input
        type="text"
        placeholder={ placeholder }
        id={ id }
        className="w-full p-2 mt-1 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-600"
      />
    </>
  );
}
