import React, { useState, useRef } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Download,
  User,
  Package,
  Calculator,
  FileText,
  Camera,
  Loader2,
  Share2,
  Phone,
  ChevronRight,
} from "lucide-react";

const GVertical = () => (
  <div className="flex flex-col gap-1 p-2 bg-stone-100/80 rounded-full hover:bg-stone-200 transition-all shadow-sm">
    <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
    <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
    <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
  </div>
);

interface Module {
  id: string;
  type: "client" | "services" | "totals" | "terms";
  data: any;
}

declare var html2pdf: any;

export const QuotationBuilder: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const [modules, setModules] = useState<Module[]>([
    {
      id: "m1",
      type: "client",
      data: {
        name: "EVELYN MONTGOMERY",
        event: "SUMMER GALA 2024",
        date: "August 14, 2024",
        phone: "+1 555 0123",
      },
    },
    {
      id: "m2",
      type: "services",
      data: [
        { name: "Full Day Documentary Photography", price: 4500, qty: 1 },
        { name: "Editorial Portrait Session", price: 1200, qty: 1 },
      ],
    },
    { id: "m3", type: "totals", data: { tax: 10, discount: 0 } },
    {
      id: "m4",
      type: "terms",
      data: "A 50% non-refundable deposit is required to secure the date. All creative outputs are subject to fine art copyright laws.",
    },
  ]);

  const addModule = (type: Module["type"]) => {
    const newId = `m-${Math.random().toString(36).substr(2, 9)}`;
    let defaultData =
      type === "services"
        ? []
        : type === "totals"
        ? { tax: 10, discount: 0 }
        : type === "client"
        ? { name: "", event: "", date: "", phone: "" }
        : "New Terms...";
    setModules([...modules, { id: newId, type, data: defaultData }]);
  };

  const removeModule = (id: string) =>
    setModules(modules.filter((m) => m.id !== id));
  const updateModuleData = (id: string, newData: any) =>
    setModules(modules.map((m) => (m.id === id ? { ...m, data: newData } : m)));

  const calculateSubtotal = () => {
    const services = modules.find((m) => m.type === "services");
    return services
      ? services.data.reduce(
          (acc: number, item: any) => acc + item.price * item.qty,
          0
        )
      : 0;
  };

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element) return;

    setIsExporting(true);

    // Allow more time for "export-mode" CSS and DOM to settle
    await new Promise((r) => setTimeout(r, 800));

    const clientName =
      modules.find((m) => m.type === "client")?.data?.name || "Client";
    const fileName = `Sagar_Photography_${clientName.replace(/\s+/g, "_")}.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        width: 800,
        scrollY: 0,
        scrollX: 0,
        onclone: (clonedDoc: Document) => {
          // Critical: Framer Motion uses transforms which can break html2canvas captures.
          // We remove transforms on the cloned document before it's rendered to canvas.
          const element = clonedDoc.getElementById("quotation-document");
          if (element) {
            element.style.transform = "none";
            const children = element.getElementsByTagName("*");
            for (let i = 0; i < children.length; i++) {
              (children[i] as HTMLElement).style.transform = "none";
            }
          }
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // Direct call to html2pdf worker
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`flex flex-col xl:flex-row gap-12 items-start relative ${
        isExporting ? "export-mode" : ""
      }`}
    >
      <div className="w-full xl:w-80 space-y-6 xl:sticky xl:top-28 z-30 print-hide">
        <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-white font-serif text-lg flex items-center gap-2 mb-6">
            <Calculator size={16} className="text-stone-500" /> Builder Tools
          </h3>
          <div className="space-y-3 mb-8">
            <button
              onClick={() => addModule("client")}
              className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-stone-300 hover:border-white hover:bg-white/10 transition-all text-xs font-bold tracking-widest uppercase"
            >
              <span className="flex items-center gap-3">
                <User size={14} /> Client
              </span>
              <Plus size={14} />
            </button>
            <button
              onClick={() => addModule("services")}
              className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-stone-300 hover:border-white hover:bg-white/10 transition-all text-xs font-bold tracking-widest uppercase"
            >
              <span className="flex items-center gap-3">
                <Package size={14} /> Service
              </span>
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-stone-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div
          ref={pdfRef}
          id="quotation-document"
          className="bg-white text-black p-12 md:p-20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-start mb-20 border-b-2 border-stone-100 pb-12">
            <div>
              <h1 className="font-serif text-5xl mb-4 tracking-tighter uppercase">
                Quotation
              </h1>
              <p className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
                Ref: SAG-{Math.floor(100 + Math.random() * 900)} /{" "}
                {new Date().getFullYear()}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mb-4">
                <Camera size={24} />
              </div>
              <span className="font-serif text-2xl tracking-tighter uppercase">
                SAGAR
              </span>
              <span className="text-[8px] tracking-[0.4em] uppercase text-stone-400 italic">
                Photography
              </span>
            </div>
          </div>

          <Reorder.Group
            axis="y"
            values={modules}
            onReorder={setModules}
            className="space-y-16"
          >
            {modules.map((module) => (
              <Reorder.Item
                key={module.id}
                value={module}
                className="group relative"
              >
                <div className="absolute -left-12 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-all print-hide cursor-grab">
                  <GVertical />
                </div>
                <button
                  onClick={() => removeModule(module.id)}
                  className="absolute -right-10 top-0 p-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all print-hide"
                >
                  <Trash2 size={16} />
                </button>

                {module.type === "client" && (
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <label className="text-[9px] font-black tracking-widest uppercase text-stone-300 mb-2 block">
                        Client
                      </label>
                      <input
                        className="w-full text-xl font-bold bg-transparent border-b border-stone-100 focus:border-black outline-none py-1"
                        value={module.data.name}
                        onChange={(e) =>
                          updateModuleData(module.id, {
                            ...module.data,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black tracking-widest uppercase text-stone-300 mb-2 block">
                        Event
                      </label>
                      <input
                        className="w-full text-xl font-bold bg-transparent border-b border-stone-100 focus:border-black outline-none py-1"
                        value={module.data.event}
                        onChange={(e) =>
                          updateModuleData(module.id, {
                            ...module.data,
                            event: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {module.type === "services" && (
                  <div>
                    <div className="grid grid-cols-12 gap-4 border-b-2 border-black pb-4 mb-8">
                      <div className="col-span-8 text-[10px] font-black uppercase tracking-widest">
                        Service
                      </div>
                      <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-right">
                        Qty
                      </div>
                      <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-right">
                        Total
                      </div>
                    </div>
                    <div className="space-y-8">
                      {module.data.map((item: any, i: number) => (
                        <div key={i} className="grid grid-cols-12 gap-4">
                          <input
                            className="col-span-8 text-lg font-bold bg-transparent outline-none"
                            value={item.name}
                            onChange={(e) => {
                              const d = [...module.data];
                              d[i].name = e.target.value;
                              updateModuleData(module.id, d);
                            }}
                          />
                          <input
                            type="number"
                            className="col-span-2 text-right font-bold bg-transparent outline-none"
                            value={item.qty}
                            onChange={(e) => {
                              const d = [...module.data];
                              d[i].qty = parseInt(e.target.value) || 0;
                              updateModuleData(module.id, d);
                            }}
                          />
                          <div className="col-span-2 text-right font-serif text-xl font-bold">
                            €{(item.price * item.qty).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        updateModuleData(module.id, [
                          ...module.data,
                          { name: "New Service", price: 0, qty: 1 },
                        ])
                      }
                      className="mt-8 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-black transition-colors print-hide"
                    >
                      + Add Service Line
                    </button>
                  </div>
                )}

                {module.type === "totals" && (
                  <div className="flex justify-end pt-12">
                    <div className="w-full max-w-xs space-y-4">
                      <div className="flex justify-between text-stone-400 uppercase tracking-widest text-[10px]">
                        <span>Subtotal</span>
                        <span className="text-black font-bold">
                          €{calculateSubtotal().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-400 uppercase tracking-widest text-[10px]">
                        <span>VAT ({module.data.tax}%)</span>
                        <span className="text-black font-bold">
                          €{(calculateSubtotal() * 0.1).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-6 border-t-2 border-black font-serif text-3xl font-bold">
                        <span>Total</span>
                        <span>
                          €{(calculateSubtotal() * 1.1).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="mt-40 grid grid-cols-2 gap-20">
            <div>
              <div className="h-px bg-stone-200 mb-6"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Sagar Director
              </p>
            </div>
            <div>
              <div className="h-px bg-stone-200 mb-6"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Client Authorization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
