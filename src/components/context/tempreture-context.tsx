import { createContext, useState, useContext } from "react";


type Unit = "C" | "F";

interface TempContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
}

export const TempContext = createContext<TempContextType | undefined>(undefined);

export const TempProvider = ({ children }: { children: React.ReactNode }) => {
    const [unit, setUnit] = useState<Unit>("C");

    return (
        <TempContext.Provider value={{ unit, setUnit }}>
            {children}
        </TempContext.Provider>
    );
}
 const useTemp = () => {
    const context = useContext(TempContext);
    if (!context) {
        throw new Error("useTemp must be used within a TempProvider");
    }
    return context;
 }
export { useTemp };