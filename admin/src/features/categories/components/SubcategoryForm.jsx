import { useEffect, useState } from "react";

export default function SubcategoryForm({
  mode,
  initialData,
  onSubmit,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name ?? "");
      return;
    }

    setName("");
  }, [mode, initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
    });
  };

  return (
    <form
      id="subcategory-form"
      onSubmit={handleSubmit}
      className="p-5"
    >
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        اسم القسم الفرعي
      </label>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoFocus
        placeholder="أدخل اسم القسم الفرعي"
        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </form>
  );
}