import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

type MarsiaState = {
  acquired: boolean;
  baseName: string;
  acquire: (name: string) => void;
  renameBase: (name: string) => void;
};

const MarsiaContext = createContext<MarsiaState | undefined>(undefined);

export function MarsiaProvider({ children }: { children: ReactNode }) {
  const [acquired, setAcquired] = useState(false);
  const [baseName, setBaseName] = useState("Base Aurora");

  useEffect(() => {
    const saved = sessionStorage.getItem("marsia-state");
    if (!saved) return;
    try {
      const value = JSON.parse(saved) as { acquired?: boolean; baseName?: string };
      setAcquired(Boolean(value.acquired));
      if (value.baseName) setBaseName(value.baseName);
    } catch { /* use prototype defaults */ }
  }, []);

  const save = (nextAcquired: boolean, nextName: string) => {
    setAcquired(nextAcquired);
    setBaseName(nextName);
    sessionStorage.setItem("marsia-state", JSON.stringify({ acquired: nextAcquired, baseName: nextName }));
  };

  return (
    <MarsiaContext.Provider value={{
      acquired,
      baseName,
      acquire: (name) => { save(true, name); toast.success("Território M-042 registrado", { description: `${name} agora faz parte da sua jornada.` }); },
      renameBase: (name) => { save(acquired, name); toast.success("Identificação da base atualizada"); },
    }}>
      {children}
    </MarsiaContext.Provider>
  );
}

export function useMarsia() {
  const context = useContext(MarsiaContext);
  if (!context) throw new Error("useMarsia requires MarsiaProvider");
  return context;
}
