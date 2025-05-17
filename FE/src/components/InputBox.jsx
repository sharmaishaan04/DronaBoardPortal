export function InputBox({ value, label, placeholder, onChange, type }) {
  return (
    <div>
      <div className="text-sm font-medium  py-2 text-left">{label}</div>
      <input
        type={type}
        required={true}
        placeholder={placeholder}
        value={value}
        className="w-full px-2 py-1 border rounded border-slate-200"
        onChange={onChange}
      />
    </div>
  );
}
