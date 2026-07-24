const { useState, useEffect } = React;

// ---------- Lightweight icon shim (emoji-based, no external icon package needed) ----------
function IconBase({ children, size = 18, color, className = "" }) {
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1, display: "inline-block", color: color || "inherit" }}>
      {children}
    </span>
  );
}
const Package = (p) => <IconBase {...p}>📦</IconBase>;
const Wrench = (p) => <IconBase {...p}>🔧</IconBase>;
const FlaskConical = (p) => <IconBase {...p}>🧪</IconBase>;
const Calculator = (p) => <IconBase {...p}>🧮</IconBase>;
const Plus = (p) => <IconBase {...p}>➕</IconBase>;
const Trash2 = (p) => <IconBase {...p}>🗑️</IconBase>;
const Pencil = (p) => <IconBase {...p}>✏️</IconBase>;
const X = (p) => <IconBase {...p}>✕</IconBase>;
const Loader2 = (p) => <IconBase {...p} className={(p.className || "") + " animate-spin"}>⏳</IconBase>;
const AlertCircle = (p) => <IconBase {...p}>⚠️</IconBase>;
const MessageSquareText = (p) => <IconBase {...p}>💬</IconBase>;
const Settings = (p) => <IconBase {...p}>⚙️</IconBase>;
const Download = (p) => <IconBase {...p}>⬇️</IconBase>;
const Upload = (p) => <IconBase {...p}>⬆️</IconBase>;
const ShieldCheck = (p) => <IconBase {...p}>✅</IconBase>;
const Home = (p) => <IconBase {...p}>🏠</IconBase>;
const Info = (p) => <IconBase {...p}>ℹ️</IconBase>;
const UserIcon = (p) => <IconBase {...p}>👤</IconBase>;
const PhoneIcon = (p) => <IconBase {...p}>📞</IconBase>;
const ChevronLeft = (p) => <IconBase {...p}>‹</IconBase>;

// ---------- Design tokens (Mellal Chem — navy & gold) ----------
const COLORS = {
  bg: "#0B1531",
  paper: "#132241",
  paperSoft: "#0F1B38",
  ink: "#F3F0E7",
  inkMuted: "#9AA6C4",
  line: "#243459",
  primary: "#16233F",
  primaryDark: "#0A1226",
  primarySoft: "#1C2C4E",
  copper: "#C9A227",
  copperDark: "#A8811C",
  copperSoft: "#3A3115",
  danger: "#E0665A",
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap";

const APP_META = {
  name: "Mellal Chem",
  nameFa: "نرم‌افزار محاسبات تولید ملل",
  tagline: "مدیریت فرمول و محاسبات تولید",
  version: "۱.۰.۰",
  creatorName: "مصطفی زارعی",
  creatorRole: "سازنده و برنامه‌نویس",
  creatorPhone: "09132254240",
  creatorPhoneFa: "۰۹۱۳۲۲۵۴۲۴۰",
};

function fmt(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("fa-IR", { maximumFractionDigits: 2 });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- Storage helpers (browser localStorage) ----------
async function loadList(key) {
  try {
    const raw = localStorage.getItem("pcc_" + key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
async function saveList(key, value) {
  try {
    localStorage.setItem("pcc_" + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- Shared UI bits ----------
function TopBar({ title, subtitle, onBack }) {
  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-5 pt-4 pb-1 text-xs font-bold"
          style={{ color: COLORS.copper, background: COLORS.primaryDark }}
        >
          <ChevronLeft size={16} /> بازگشت به خانه
        </button>
      )}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: "#fff",
        }}
        className="px-5 pt-4 pb-5"
      >
        <div className="text-lg font-bold" style={{ color: COLORS.ink }}>{title}</div>
        {subtitle && (
          <div className="text-xs mt-1" style={{ color: "#B7C2E4" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text, hint }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="rounded-full p-4 mb-3" style={{ background: COLORS.primarySoft }}>
        <Icon size={26} color={COLORS.copper} />
      </div>
      <div className="font-semibold" style={{ color: COLORS.ink }}>
        {text}
      </div>
      {hint && (
        <div className="text-sm mt-1" style={{ color: COLORS.inkMuted }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div className="text-xs font-semibold mb-1.5" style={{ color: COLORS.inkMuted }}>
      {children}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      style={{ border: `1.5px solid ${COLORS.line}`, background: "#101B33", color: COLORS.ink, ...props.style }}
    />
  );
}

function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      style={{ border: `1.5px solid ${COLORS.line}`, background: "#101B33", color: COLORS.ink }}
    >
      {props.children}
    </select>
  );
}

function PrimaryButton({ children, onClick, disabled, style, as }) {
  const Tag = as || "button";
  return (
    <Tag
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-1.5"
      style={{
        background: disabled ? "#33415F" : COLORS.copper,
        color: "#fff",
        opacity: disabled ? 0.7 : 1,
        textDecoration: "none",
        pointerEvents: disabled ? "none" : "auto",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

function GhostButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl px-4 py-2.5 text-sm font-semibold"
      style={{ background: "transparent", color: COLORS.inkMuted, border: `1.5px solid ${COLORS.line}`, ...style }}
    >
      {children}
    </button>
  );
}

function Toggle2({ value, onChange, optionA, optionB }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(optionA.value)}
        className="flex-1 rounded-lg py-1.5 text-xs font-bold"
        style={{
          background: value === optionA.value ? COLORS.copper : "#182742",
          color: value === optionA.value ? COLORS.primaryDark : COLORS.inkMuted,
        }}
      >
        {optionA.label}
      </button>
      <button
        onClick={() => onChange(optionB.value)}
        className="flex-1 rounded-lg py-1.5 text-xs font-bold"
        style={{
          background: value === optionB.value ? COLORS.copper : "#182742",
          color: value === optionB.value ? COLORS.primaryDark : COLORS.inkMuted,
        }}
      >
        {optionB.label}
      </button>
    </div>
  );
}

// ---------- Materials tab ----------
function MaterialsTab({ items, setItems, setTab }) {
  const [form, setForm] = useState({ id: null, name: "", price: "" });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm({ id: null, name: "", price: "" });
    setShowForm(false);
  };

  const submit = async () => {
    if (!form.name.trim() || form.price === "") return;
    setSaving(true);
    let next;
    if (form.id) {
      next = items.map((it) => (it.id === form.id ? { ...it, name: form.name.trim(), price: Number(form.price) } : it));
    } else {
      next = [...items, { id: uid(), name: form.name.trim(), price: Number(form.price) }];
    }
    setItems(next);
    await saveList("materials", next);
    setSaving(false);
    resetForm();
  };

  const startEdit = (it) => {
    setForm({ id: it.id, name: it.name, price: String(it.price) });
    setShowForm(true);
  };

  const remove = async (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    await saveList("materials", next);
  };

  return (
    <div>
      <TopBar title="مواد اولیه" subtitle="تعریف متریال و قیمت هر کیلوگرم" onBack={() => setTab("home")} />
      <div className="px-4 -mt-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
            style={{ background: COLORS.paper, color: COLORS.copper, border: `1.5px dashed ${COLORS.copper}55` }}
          >
            <Plus size={17} /> افزودن متریال جدید
          </button>
        ) : (
          <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm" style={{ color: COLORS.copper }}>
                {form.id ? "ویرایش" : "متریال جدید"}
              </div>
              <button onClick={resetForm}>
                <X size={18} color={COLORS.inkMuted} />
              </button>
            </div>
            <FieldLabel>نام</FieldLabel>
            <TextInput placeholder="مثلاً روغن پایه" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="h-3" />
            <FieldLabel>قیمت (تومان به ازای هر کیلوگرم)</FieldLabel>
            <TextInput type="number" inputMode="decimal" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <div className="h-4" />
            <div className="flex gap-2">
              <PrimaryButton onClick={submit} disabled={saving} style={{ flex: 1 }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : "ذخیره"}
              </PrimaryButton>
              <GhostButton onClick={resetForm}>انصراف</GhostButton>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-4 pb-6">
        {items.length === 0 ? (
          <EmptyState icon={Package} text="هنوز متریالی ثبت نشده" hint="اولین مورد را اضافه کنید" />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-2xl p-3.5 flex items-center justify-between shadow-sm" style={{ background: COLORS.paper }}>
                <div>
                  <div className="font-semibold text-sm" style={{ color: COLORS.ink }}>{it.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: COLORS.copperDark }}>{fmt(it.price)} تومان / کیلوگرم</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(it)} className="rounded-full p-2" style={{ background: COLORS.primarySoft }}>
                    <Pencil size={14} color={COLORS.copper} />
                  </button>
                  <button onClick={() => remove(it.id)} className="rounded-full p-2" style={{ background: "#3A1E1C" }}>
                    <Trash2 size={14} color={COLORS.danger} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Services tab (with price type: per kg vs per whole batch) ----------
function ServicesTab({ items, setItems, setTab }) {
  const empty = { id: null, name: "", price: "", priceType: "per_kg" };
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(empty);
    setShowForm(false);
  };

  const submit = async () => {
    if (!form.name.trim() || form.price === "") return;
    setSaving(true);
    let next;
    if (form.id) {
      next = items.map((it) =>
        it.id === form.id ? { ...it, name: form.name.trim(), price: Number(form.price), priceType: form.priceType } : it
      );
    } else {
      next = [...items, { id: uid(), name: form.name.trim(), price: Number(form.price), priceType: form.priceType }];
    }
    setItems(next);
    await saveList("services", next);
    setSaving(false);
    resetForm();
  };

  const startEdit = (it) => {
    setForm({ id: it.id, name: it.name, price: String(it.price), priceType: it.priceType || "per_kg" });
    setShowForm(true);
  };

  const remove = async (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    await saveList("services", next);
  };

  return (
    <div>
      <TopBar title="خدمات تولید" subtitle="مثلاً دستمزد ساخت، بسته‌بندی و..." onBack={() => setTab("home")} />
      <div className="px-4 -mt-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
            style={{ background: COLORS.paper, color: COLORS.copper, border: `1.5px dashed ${COLORS.copper}55` }}
          >
            <Plus size={17} /> افزودن خدمت جدید
          </button>
        ) : (
          <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm" style={{ color: COLORS.copper }}>{form.id ? "ویرایش" : "خدمت جدید"}</div>
              <button onClick={resetForm}>
                <X size={18} color={COLORS.inkMuted} />
              </button>
            </div>
            <FieldLabel>نام</FieldLabel>
            <TextInput placeholder="مثلاً دستمزد ساخت" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="h-3" />
            <FieldLabel>نحوه محاسبه قیمت</FieldLabel>
            <Toggle2
              value={form.priceType}
              onChange={(v) => setForm({ ...form, priceType: v })}
              optionA={{ value: "per_kg", label: "به ازای هر کیلوگرم" }}
              optionB={{ value: "per_batch", label: "ثابت برای کل بچ" }}
            />
            <div className="h-3" />
            <FieldLabel>{form.priceType === "per_kg" ? "قیمت (تومان به ازای هر کیلوگرم محصول)" : "قیمت ثابت (تومان برای کل این بچ تولید)"}</FieldLabel>
            <TextInput type="number" inputMode="decimal" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <div className="h-4" />
            <div className="flex gap-2">
              <PrimaryButton onClick={submit} disabled={saving} style={{ flex: 1 }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : "ذخیره"}
              </PrimaryButton>
              <GhostButton onClick={resetForm}>انصراف</GhostButton>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-4 pb-6">
        {items.length === 0 ? (
          <EmptyState icon={Wrench} text="هنوز خدمتی ثبت نشده" hint="اولین مورد را اضافه کنید" />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-2xl p-3.5 flex items-center justify-between shadow-sm" style={{ background: COLORS.paper }}>
                <div>
                  <div className="font-semibold text-sm" style={{ color: COLORS.ink }}>{it.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: COLORS.copperDark }}>
                    {fmt(it.price)} تومان {it.priceType === "per_batch" ? "· ثابت برای کل بچ" : "· به ازای هر کیلوگرم"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(it)} className="rounded-full p-2" style={{ background: COLORS.primarySoft }}>
                    <Pencil size={14} color={COLORS.copper} />
                  </button>
                  <button onClick={() => remove(it.id)} className="rounded-full p-2" style={{ background: "#3A1E1C" }}>
                    <Trash2 size={14} color={COLORS.danger} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Formulas tab ----------
function FormulasTab({ materials, services, formulas, setFormulas, setTab }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [rows, setRows] = useState([]); // {refType, refId, amount?}
  const [rowType, setRowType] = useState("material");
  const [rowRef, setRowRef] = useState("");
  const [rowAmount, setRowAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const usedServiceIds = rows.filter((r) => r.refType === "service").map((r) => r.refId);
  const availableServices = services.filter((s) => !usedServiceIds.includes(s.id));

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setBatchSize("");
    setRows([]);
    setRowType("material");
    setRowRef("");
    setRowAmount("");
    setError("");
  };

  const addMaterialRow = () => {
    if (!rowRef || !rowAmount) return;
    setRows([...rows, { refType: "material", refId: rowRef, amount: Number(rowAmount) }]);
    setRowRef("");
    setRowAmount("");
  };

  // Services attach directly on selection - no amount needed, their own
  // definition (per kg / per batch) decides how the cost is computed later.
  const addServiceRow = (serviceId) => {
    if (!serviceId) return;
    setRows([...rows, { refType: "service", refId: serviceId }]);
  };

  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const materialRows = rows.filter((r) => r.refType === "material");
  const materialSum = materialRows.reduce((s, r) => s + r.amount, 0);

  const submit = async () => {
    setError("");
    if (!name.trim() || !batchSize || rows.length === 0) {
      setError("نام، اندازه دسته و حداقل یک جزء لازم است");
      return;
    }
    setSaving(true);
    const record = { id: editingId || uid(), name: name.trim(), batchSize: Number(batchSize), items: rows };
    let next;
    if (editingId) {
      next = formulas.map((f) => (f.id === editingId ? record : f));
    } else {
      next = [...formulas, record];
    }
    setFormulas(next);
    await saveList("formulas", next);
    setSaving(false);
    resetForm();
  };

  const startEdit = (f) => {
    setEditingId(f.id);
    setName(f.name);
    setBatchSize(String(f.batchSize));
    setRows(f.items);
    setShowForm(true);
  };

  const remove = async (id) => {
    const next = formulas.filter((f) => f.id !== id);
    setFormulas(next);
    await saveList("formulas", next);
  };

  const nameFor = (refType, refId) => {
    const src = refType === "material" ? materials : services;
    const found = src.find((x) => x.id === refId);
    return found || { name: "(حذف شده)", price: 0 };
  };

  const noSources = materials.length === 0 && services.length === 0;

  return (
    <div>
      <TopBar title="فرمول‌های تولید" subtitle="ترکیب متریال و خدمات برای یک دسته" onBack={() => setTab("home")} />
      <div className="px-4 -mt-3">
        {!showForm ? (
          noSources ? (
            <div className="rounded-2xl p-3.5 flex items-start gap-2.5 shadow-sm" style={{ background: COLORS.copperSoft }}>
              <AlertCircle size={18} color={COLORS.copperDark} className="mt-0.5 shrink-0" />
              <div className="text-xs" style={{ color: COLORS.copperDark }}>
                برای ساخت فرمول، اول حداقل یک متریال یا خدمت در بخش‌های مربوطه ثبت کنید.
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
              style={{ background: COLORS.paper, color: COLORS.copper, border: `1.5px dashed ${COLORS.copper}55` }}
            >
              <Plus size={17} /> فرمول جدید
            </button>
          )
        ) : (
          <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm" style={{ color: COLORS.copper }}>{editingId ? "ویرایش فرمول" : "فرمول جدید"}</div>
              <button onClick={resetForm}>
                <X size={18} color={COLORS.inkMuted} />
              </button>
            </div>

            <FieldLabel>نام فرمول</FieldLabel>
            <TextInput placeholder="مثلاً فرمول کرم پایه" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="h-3" />
            <FieldLabel>اندازه دسته تولید (کیلوگرم)</FieldLabel>
            <TextInput type="number" inputMode="decimal" placeholder="مثلاً 60" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />

            <div className="h-4" />
            <div className="rounded-xl p-3" style={{ background: "#101B33", border: `1.5px solid ${COLORS.line}` }}>
              <FieldLabel>افزودن جزء به فرمول</FieldLabel>
              <Toggle2
                value={rowType}
                onChange={(v) => { setRowType(v); setRowRef(""); setRowAmount(""); }}
                optionA={{ value: "material", label: "متریال" }}
                optionB={{ value: "service", label: "خدمت" }}
              />
              <div className="h-2" />

              {rowType === "material" ? (
                materials.length === 0 ? (
                  <div className="text-xs" style={{ color: COLORS.inkMuted }}>هیچ متریالی ثبت نشده.</div>
                ) : (
                  <>
                    <SelectInput value={rowRef} onChange={(e) => setRowRef(e.target.value)}>
                      <option value="">انتخاب متریال...</option>
                      {materials.map((o) => (
                        <option key={o.id} value={o.id}>{o.name} ({fmt(o.price)} ت/کیلو)</option>
                      ))}
                    </SelectInput>
                    <div className="h-2" />
                    <div className="flex gap-2">
                      <TextInput type="number" inputMode="decimal" placeholder="مقدار (کیلوگرم)" value={rowAmount} onChange={(e) => setRowAmount(e.target.value)} />
                      <button onClick={addMaterialRow} className="rounded-xl px-4 shrink-0" style={{ background: COLORS.copper, color: "#fff" }}>
                        <Plus size={18} />
                      </button>
                    </div>
                  </>
                )
              ) : services.length === 0 ? (
                <div className="text-xs" style={{ color: COLORS.inkMuted }}>هیچ خدمتی ثبت نشده.</div>
              ) : availableServices.length === 0 ? (
                <div className="text-xs" style={{ color: COLORS.inkMuted }}>همه خدمات ثبت‌شده قبلاً به این فرمول اضافه شده‌اند.</div>
              ) : (
                <SelectInput value="" onChange={(e) => addServiceRow(e.target.value)}>
                  <option value="">انتخاب و افزودن خدمت...</option>
                  {availableServices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({fmt(o.price)} ت {o.priceType === "per_batch" ? "ثابت/بچ" : "به ازای کیلو"})
                    </option>
                  ))}
                </SelectInput>
              )}
            </div>

            {rows.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                {rows.map((r, idx) => {
                  const src = nameFor(r.refType, r.refId);
                  return (
                    <div key={idx} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: COLORS.primarySoft }}>
                      <div className="text-xs font-semibold" style={{ color: COLORS.copper }}>
                        {src.name}
                        <span style={{ color: COLORS.inkMuted, fontWeight: 400 }}>
                          {" "}· {r.refType === "material" ? "متریال" : src.priceType === "per_batch" ? "خدمت (ثابت/بچ)" : "خدمت (به ازای کیلو)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.refType === "material" && (
                          <span className="text-xs font-bold" style={{ color: COLORS.ink }}>{fmt(r.amount)} kg</span>
                        )}
                        <button onClick={() => removeRow(idx)}>
                          <X size={14} color={COLORS.danger} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="text-xs text-left mt-1" style={{ color: COLORS.inkMuted }}>
                  جمع مواد اولیه: {fmt(materialSum)} کیلوگرم
                  {batchSize && Number(batchSize) !== materialSum && (
                    <span style={{ color: COLORS.danger }}> (با اندازه دسته {fmt(Number(batchSize))} برابر نیست)</span>
                  )}
                </div>
              </div>
            )}

            {error && <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.danger }}>{error}</div>}

            <div className="h-4" />
            <div className="flex gap-2">
              <PrimaryButton onClick={submit} disabled={saving} style={{ flex: 1 }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : "ذخیره فرمول"}
              </PrimaryButton>
              <GhostButton onClick={resetForm}>انصراف</GhostButton>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-4 pb-6">
        {formulas.length === 0 ? (
          <EmptyState icon={FlaskConical} text="هنوز فرمولی ثبت نشده" hint="یک فرمول جدید بسازید" />
        ) : (
          <div className="flex flex-col gap-2">
            {formulas.map((f) => (
              <div key={f.id} className="rounded-2xl p-3.5 shadow-sm" style={{ background: COLORS.paper }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.ink }}>{f.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: COLORS.inkMuted }}>دسته {fmt(f.batchSize)} کیلوگرمی · {f.items.length} جزء</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(f)} className="rounded-full p-2" style={{ background: COLORS.primarySoft }}>
                      <Pencil size={14} color={COLORS.copper} />
                    </button>
                    <button onClick={() => remove(f.id)} className="rounded-full p-2" style={{ background: "#3A1E1C" }}>
                      <Trash2 size={14} color={COLORS.danger} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Calculate tab ----------
function CalculateTab({ materials, services, formulas, setTab }) {
  const [formulaId, setFormulaId] = useState("");
  const [qty, setQty] = useState("");
  const [result, setResult] = useState(null);
  const [smsPhone, setSmsPhone] = useState("");

  const nameFor = (refType, refId) => {
    const src = refType === "material" ? materials : services;
    return src.find((x) => x.id === refId) || { name: "(حذف شده)", price: 0 };
  };

  const compute = () => {
    const f = formulas.find((x) => x.id === formulaId);
    if (!f || !qty) {
      setResult(null);
      return;
    }
    const ratio = Number(qty) / f.batchSize;

    const materialLines = f.items
      .filter((it) => it.refType === "material")
      .map((it) => {
        const src = nameFor("material", it.refId);
        const amount = it.amount * ratio;
        return { name: src.name, amount, unitPrice: src.price, cost: amount * src.price };
      });

    const serviceLines = f.items
      .filter((it) => it.refType === "service")
      .map((it) => {
        const src = nameFor("service", it.refId);
        const isBatch = src.priceType === "per_batch";
        const cost = isBatch ? src.price : src.price * Number(qty);
        return { name: src.name, priceType: src.priceType, unitPrice: src.price, cost };
      });

    const materialTotal = materialLines.reduce((s, l) => s + l.cost, 0);
    const serviceTotal = serviceLines.reduce((s, l) => s + l.cost, 0);
    const total = materialTotal + serviceTotal;

    setResult({
      formula: f,
      qty: Number(qty),
      materialLines,
      serviceLines,
      materialTotal,
      serviceTotal,
      total,
      perKg: total / Number(qty),
    });
  };

  const materialPct = result && result.total > 0 ? (result.materialTotal / result.total) * 100 : 0;

  const smsBody = result
    ? `${result.formula.name} (${fmt(result.qty)} kg)\n` +
      result.materialLines.map((l) => `${l.name} = ${fmt(l.amount)}`).join("\n")
    : "";
  const cleanPhone = smsPhone.trim().replace(/\s+/g, "");
  const smsHref = result && cleanPhone ? `sms:${cleanPhone}?body=${encodeURIComponent(smsBody)}` : "#";

  return (
    <div>
      <TopBar title="محاسبه قیمت تولید" subtitle="بر اساس فرمول، مقدار مورد نظر را قیمت‌گذاری کنید" onBack={() => setTab("home")} />
      <div className="px-4 -mt-3">
        <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
          {formulas.length === 0 ? (
            <div className="text-xs" style={{ color: COLORS.inkMuted }}>اول یک فرمول در بخش «فرمول‌ها» بسازید.</div>
          ) : (
            <>
              <FieldLabel>انتخاب فرمول</FieldLabel>
              <SelectInput value={formulaId} onChange={(e) => { setFormulaId(e.target.value); setResult(null); }}>
                <option value="">فرمول را انتخاب کنید...</option>
                {formulas.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} (دسته {fmt(f.batchSize)} کیلوگرمی)</option>
                ))}
              </SelectInput>
              <div className="h-3" />
              <FieldLabel>مقدار درخواستی (کیلوگرم)</FieldLabel>
              <TextInput type="number" inputMode="decimal" placeholder="مثلاً 10" value={qty} onChange={(e) => setQty(e.target.value)} />
              <div className="h-4" />
              <PrimaryButton onClick={compute} disabled={!formulaId || !qty} style={{ width: "100%" }}>
                <Calculator size={16} /> محاسبه
              </PrimaryButton>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="px-4 mt-4 pb-6">
          {/* Step 1: quantities table (no money) */}
          <div className="rounded-2xl overflow-hidden shadow-sm mb-2" style={{ background: COLORS.paper }}>
            <div className="px-4 py-2.5 text-xs font-bold" style={{ background: COLORS.primarySoft, color: COLORS.copper }}>
              میزان مواد اولیه مورد نیاز برای {fmt(result.qty)} کیلوگرم
            </div>
            {result.materialLines.length === 0 ? (
              <div className="px-4 py-3 text-xs" style={{ color: COLORS.inkMuted }}>این فرمول متریالی ندارد.</div>
            ) : (
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                    <th className="text-right px-4 py-2 text-xs font-semibold" style={{ color: COLORS.inkMuted }}>نام ماده</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: COLORS.inkMuted }}>مقدار (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.materialLines.map((l, idx) => (
                    <tr key={idx} style={{ borderTop: idx > 0 ? `1px solid ${COLORS.line}` : "none" }}>
                      <td className="px-4 py-2.5 font-semibold" style={{ color: COLORS.ink }}>{l.name}</td>
                      <td className="px-4 py-2.5 text-left font-bold" style={{ color: COLORS.copper }}>{fmt(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-2xl p-4 shadow-sm mb-4" style={{ background: COLORS.paper }}>
            <FieldLabel>شماره تماس گیرنده</FieldLabel>
            <TextInput
              type="tel"
              inputMode="tel"
              placeholder="09xxxxxxxxx"
              value={smsPhone}
              onChange={(e) => setSmsPhone(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <PrimaryButton
              as="a"
              href={smsHref}
              disabled={!cleanPhone}
              style={{ width: "100%", background: COLORS.primary }}
            >
              <MessageSquareText size={16} /> باز کردن پیش‌نویس پیامک
            </PrimaryButton>
          </div>

          {/* Step 2: cost calculation */}
          <div className="rounded-2xl p-5 mb-3 text-center shadow-sm" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}>
            <div className="text-xs" style={{ color: "#B7C2E4" }}>قیمت تمام‌شده برای {fmt(result.qty)} کیلوگرم «{result.formula.name}»</div>
            <div className="text-3xl font-extrabold mt-2" style={{ color: COLORS.copper }}>
              {fmt(result.total)} <span className="text-sm font-semibold">تومان</span>
            </div>
            <div className="text-xs mt-1.5" style={{ color: "#B7C2E4" }}>معادل {fmt(result.perKg)} تومان به ازای هر کیلوگرم</div>
          </div>

          <div className="rounded-2xl p-4 mb-3 shadow-sm" style={{ background: COLORS.paper }}>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span style={{ color: COLORS.copper }}>سهم متریال</span>
              <span style={{ color: "#8FA9D8" }}>سهم خدمات</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: COLORS.line }}>
              <div style={{ width: `${materialPct}%`, background: COLORS.copper }} />
              <div style={{ width: `${100 - materialPct}%`, background: "#4C6FA5" }} />
            </div>
            <div className="flex items-center justify-between text-xs mt-2" style={{ color: COLORS.inkMuted }}>
              <span>{fmt(result.materialTotal)} ت ({fmt(materialPct)}٪)</span>
              <span>{fmt(result.serviceTotal)} ت ({fmt(100 - materialPct)}٪)</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: COLORS.paper }}>
            <div className="px-4 py-2.5 text-xs font-bold" style={{ background: COLORS.primarySoft, color: COLORS.copper }}>
              جزئیات هزینه
            </div>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                  <th className="text-right px-4 py-2 text-xs font-semibold" style={{ color: COLORS.inkMuted }}>نام</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold" style={{ color: COLORS.inkMuted }}>توضیح</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: COLORS.inkMuted }}>هزینه</th>
                </tr>
              </thead>
              <tbody>
                {result.materialLines.map((l, idx) => (
                  <tr key={"m" + idx} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: COLORS.ink }}>{l.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: COLORS.inkMuted }}>{fmt(l.amount)} kg × {fmt(l.unitPrice)} ت</td>
                    <td className="px-4 py-2.5 text-left font-bold" style={{ color: COLORS.copperDark }}>{fmt(l.cost)} ت</td>
                  </tr>
                ))}
                {result.serviceLines.map((l, idx) => (
                  <tr key={"s" + idx} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: COLORS.ink }}>{l.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: COLORS.inkMuted }}>
                      {l.priceType === "per_batch" ? "ثابت برای کل بچ" : `${fmt(result.qty)} kg × ${fmt(l.unitPrice)} ت`}
                    </td>
                    <td className="px-4 py-2.5 text-left font-bold" style={{ color: COLORS.copperDark }}>{fmt(l.cost)} ت</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Settings tab (backup / restore) ----------
function SettingsTab({ materials, services, formulas, setMaterials, setServices, setFormulas, setTab }) {
  const [pending, setPending] = useState(null); // parsed backup waiting for confirmation
  const [fileError, setFileError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  const doExport = () => {
    const payload = {
      type: "production-cost-calculator-backup",
      exportedAt: new Date().toISOString(),
      materials,
      services,
      formulas,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `پشتیبان-قیمت-تولید-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onFileChosen = (e) => {
    setFileError("");
    setDone("");
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || (!Array.isArray(data.materials) && !Array.isArray(data.services) && !Array.isArray(data.formulas))) {
          setFileError("این فایل، فایل پشتیبان معتبری به نظر نمی‌رسد.");
          return;
        }
        setPending({
          materials: Array.isArray(data.materials) ? data.materials : [],
          services: Array.isArray(data.services) ? data.services : [],
          formulas: Array.isArray(data.formulas) ? data.formulas : [],
          exportedAt: data.exportedAt,
        });
      } catch (err) {
        setFileError("خواندن فایل ممکن نشد. فایل باید همان فایل خروجی این اپ باشد.");
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = async () => {
    if (!pending) return;
    setBusy(true);
    setMaterials(pending.materials);
    setServices(pending.services);
    setFormulas(pending.formulas);
    await Promise.all([
      saveList("materials", pending.materials),
      saveList("services", pending.services),
      saveList("formulas", pending.formulas),
    ]);
    setBusy(false);
    setDone("اطلاعات با موفقیت بازیابی شد.");
    setPending(null);
  };

  return (
    <div>
      <TopBar title="پشتیبان‌گیری و بازیابی" subtitle="اطلاعات را در فایل ذخیره یا از فایل بازیابی کنید" onBack={() => setTab("home")} />
      <div className="px-4 -mt-3 flex flex-col gap-3 pb-6">
        <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Download size={16} color={COLORS.copper} />
            <div className="font-bold text-sm" style={{ color: COLORS.copper }}>تهیه فایل پشتیبان</div>
          </div>
          <div className="text-xs mb-3" style={{ color: COLORS.inkMuted }}>
            یک فایل شامل {fmt(materials.length)} متریال، {fmt(services.length)} خدمت و {fmt(formulas.length)} فرمول دانلود می‌شود.
          </div>
          <PrimaryButton onClick={doExport} style={{ width: "100%" }}>
            <Download size={16} /> دانلود فایل پشتیبان
          </PrimaryButton>
        </div>

        <div className="rounded-2xl p-4 shadow-sm" style={{ background: COLORS.paper }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Upload size={16} color={COLORS.copper} />
            <div className="font-bold text-sm" style={{ color: COLORS.copper }}>بازیابی از فایل پشتیبان</div>
          </div>
          <div className="text-xs mb-3" style={{ color: COLORS.inkMuted }}>
            با انتخاب فایل، اطلاعات فعلی اپ (متریال، خدمات و فرمول‌ها) با محتوای فایل جایگزین می‌شود.
          </div>

          <label
            className="rounded-xl px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ background: COLORS.primarySoft, color: COLORS.copper }}
          >
            <Upload size={16} /> انتخاب فایل پشتیبان
            <input type="file" accept="application/json,.json" onChange={onFileChosen} style={{ display: "none" }} />
          </label>

          {fileError && (
            <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.danger }}>{fileError}</div>
          )}
          {done && (
            <div className="flex items-center gap-1.5 text-xs mt-2 font-semibold" style={{ color: COLORS.copper }}>
              <ShieldCheck size={14} /> {done}
            </div>
          )}

          {pending && (
            <div className="rounded-xl p-3 mt-3" style={{ background: COLORS.copperSoft }}>
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle size={16} color={COLORS.copperDark} className="mt-0.5 shrink-0" />
                <div className="text-xs" style={{ color: COLORS.copperDark }}>
                  این فایل شامل {fmt(pending.materials.length)} متریال، {fmt(pending.services.length)} خدمت و {fmt(pending.formulas.length)} فرمول است.
                  با تأیید، اطلاعات فعلی اپ برای همیشه با این فایل جایگزین می‌شود.
                </div>
              </div>
              <div className="flex gap-2">
                <PrimaryButton onClick={confirmRestore} disabled={busy} style={{ flex: 1 }}>
                  {busy ? <Loader2 size={16} className="animate-spin" /> : "تأیید و جایگزینی اطلاعات"}
                </PrimaryButton>
                <GhostButton onClick={() => setPending(null)}>انصراف</GhostButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Home tab (card grid) ----------
function HomeTab({ setTab, counts }) {
  const cards = [
    { key: "formulas", label: "فرمولاسیون", desc: "تعریف فرمول تولید", icon: FlaskConical },
    { key: "materials", label: "مواد اولیه", desc: `${fmt(counts.materials)} متریال ثبت‌شده`, icon: Package },
    { key: "services", label: "خدمات تولید", desc: `${fmt(counts.services)} خدمت ثبت‌شده`, icon: Wrench },
    { key: "calc", label: "محاسبات سریع", desc: "قیمت تمام‌شده تولید", icon: Calculator },
    { key: "settings", label: "پشتیبان‌گیری", desc: "ذخیره و بازیابی اطلاعات", icon: ShieldCheck },
    { key: "about", label: "درباره برنامه", desc: `نسخه ${APP_META.version}`, icon: Info },
  ];

  return (
    <div>
      <div
        style={{ background: `linear-gradient(160deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
        className="px-5 pt-8 pb-7 flex flex-col items-center text-center"
      >
        <img
          src="icon-192.png"
          alt="Mellal Chem"
          className="rounded-2xl mb-3"
          style={{ width: 64, height: 64, boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}
        />
        <div className="text-lg font-extrabold" style={{ color: COLORS.copper }}>
          {APP_META.name}
        </div>
        <div className="text-xs mt-1" style={{ color: COLORS.ink }}>{APP_META.nameFa}</div>
        <div className="text-xs mt-0.5" style={{ color: "#B7C2E4" }}>{APP_META.tagline}</div>
      </div>

      <div className="px-4 -mt-4 pb-6 grid grid-cols-2 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className="rounded-2xl p-4 text-right shadow-sm flex flex-col items-start gap-2"
              style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}` }}
            >
              <div className="rounded-xl p-2" style={{ background: COLORS.copperSoft }}>
                <Icon size={20} color={COLORS.copper} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: COLORS.ink }}>{c.label}</div>
                <div className="text-xs mt-0.5" style={{ color: COLORS.inkMuted }}>{c.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- About tab ----------
function AboutTab({ setTab }) {
  return (
    <div>
      <TopBar title="درباره برنامه" subtitle={APP_META.name} onBack={() => setTab("home")} />
      <div className="px-4 -mt-3 pb-6">
        <div className="rounded-2xl p-5 shadow-sm flex flex-col items-center text-center" style={{ background: COLORS.paper }}>
          <img src="icon-192.png" alt="" className="rounded-2xl mb-3" style={{ width: 72, height: 72 }} />
          <div className="text-base font-extrabold" style={{ color: COLORS.copper }}>{APP_META.name}</div>
          <div className="text-xs mt-1" style={{ color: COLORS.inkMuted }}>{APP_META.tagline}</div>
          <div
            className="text-xs font-bold mt-3 px-3 py-1 rounded-full"
            style={{ background: COLORS.copperSoft, color: COLORS.copper }}
          >
            نسخه {APP_META.version}
          </div>
        </div>

        <div className="rounded-2xl p-4 mt-3 shadow-sm text-xs leading-6" style={{ background: COLORS.paper, color: COLORS.inkMuted }}>
          این نرم‌افزار برای ثبت مواد اولیه، خدمات تولید، تعریف فرمول‌های ساخت و محاسبه قیمت تمام‌شده تولید طراحی شده است.
        </div>

        <button
          onClick={() => setTab("creator")}
          className="w-full rounded-2xl p-4 mt-3 shadow-sm flex items-center justify-between"
          style={{ background: COLORS.paper }}
        >
          <div className="flex items-center gap-2">
            <UserIcon size={18} color={COLORS.copper} />
            <span className="text-sm font-bold" style={{ color: COLORS.ink }}>اطلاعات سازنده</span>
          </div>
          <ChevronLeft size={20} color={COLORS.inkMuted} />
        </button>
      </div>
    </div>
  );
}

// ---------- Creator tab ----------
function CreatorTab({ setTab }) {
  return (
    <div>
      <TopBar title="اطلاعات سازنده" subtitle={APP_META.name} onBack={() => setTab("home")} />
      <div className="px-4 -mt-3 pb-6">
        <div className="rounded-2xl p-5 shadow-sm flex flex-col items-center text-center" style={{ background: COLORS.paper }}>
          <div
            className="rounded-full flex items-center justify-center font-extrabold mb-3"
            style={{ width: 76, height: 76, background: COLORS.copperSoft, color: COLORS.copper, fontSize: 26 }}
          >
            م.ز
          </div>
          <div className="text-base font-extrabold" style={{ color: COLORS.ink }}>{APP_META.creatorName}</div>
          <div className="text-xs mt-1" style={{ color: COLORS.inkMuted }}>{APP_META.creatorRole}</div>
        </div>

        <a
          href={`tel:${APP_META.creatorPhone}`}
          className="w-full rounded-2xl p-4 mt-3 shadow-sm flex items-center justify-between"
          style={{ background: COLORS.paper, textDecoration: "none" }}
        >
          <div className="flex items-center gap-2">
            <PhoneIcon size={18} color={COLORS.copper} />
            <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>{APP_META.creatorPhoneFa}</span>
          </div>
          <span className="text-xs font-bold" style={{ color: COLORS.copper }}>تماس</span>
        </a>
      </div>
    </div>
  );
}

// ---------- Splash screen ----------
function Splash() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: COLORS.primaryDark, zIndex: 50 }}
    >
      <img src="splash.jpg" alt="Mellal Chem" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

// ---------- Bottom nav ----------
function BottomNav({ tab, setTab }) {
  const items = [
    { key: "creator", label: "اطلاعات سازنده", icon: UserIcon },
    { key: "home", label: "خانه", icon: Home },
    { key: "about", label: "درباره برنامه", icon: Info },
  ];
  return (
    <div className="flex items-stretch" style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}` }}>
      {items.map((it) => {
        const active = tab === it.key;
        const Icon = it.icon;
        return (
          <button key={it.key} onClick={() => setTab(it.key)} className="flex-1 flex flex-col items-center gap-1 py-2.5">
            <Icon size={19} color={active ? COLORS.copper : COLORS.inkMuted} />
            <span className="text-xs" style={{ color: active ? COLORS.copper : COLORS.inkMuted, fontWeight: active ? 700 : 500 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Root app ----------
function App() {
  const [tab, setTab] = useState("home");
  const [materials, setMaterials] = useState([]);
  const [services, setServices] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = FONT_URL;
    document.head.appendChild(fontLink);

    const splashTimer = setTimeout(() => setShowSplash(false), 1800);

    (async () => {
      const [m, s, f] = await Promise.all([loadList("materials"), loadList("services"), loadList("formulas")]);
      setMaterials(m);
      setServices(s);
      setFormulas(f);
      setLoading(false);
    })();

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div dir="rtl" style={{ fontFamily: "'Vazirmatn', sans-serif", background: "#05070F" }} className="w-full min-h-screen flex items-center justify-center py-4">
      <div
        className="w-full flex flex-col overflow-hidden relative"
        style={{
          maxWidth: 420,
          height: "92vh",
          maxHeight: 820,
          background: COLORS.bg,
          borderRadius: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          border: `6px solid ${COLORS.primaryDark}`,
        }}
      >
        {(showSplash || loading) && <Splash />}
        <div className="flex-1 overflow-y-auto">
          {!loading && (
            <>
              {tab === "home" && (
                <HomeTab setTab={setTab} counts={{ materials: materials.length, services: services.length, formulas: formulas.length }} />
              )}
              {tab === "materials" && <MaterialsTab items={materials} setItems={setMaterials} setTab={setTab} />}
              {tab === "services" && <ServicesTab items={services} setItems={setServices} setTab={setTab} />}
              {tab === "formulas" && (
                <FormulasTab materials={materials} services={services} formulas={formulas} setFormulas={setFormulas} setTab={setTab} />
              )}
              {tab === "calc" && <CalculateTab materials={materials} services={services} formulas={formulas} setTab={setTab} />}
              {tab === "settings" && (
                <SettingsTab
                  materials={materials}
                  services={services}
                  formulas={formulas}
                  setMaterials={setMaterials}
                  setServices={setServices}
                  setFormulas={setFormulas}
                  setTab={setTab}
                />
              )}
              {tab === "about" && <AboutTab setTab={setTab} />}
              {tab === "creator" && <CreatorTab setTab={setTab} />}
            </>
          )}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}


const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
