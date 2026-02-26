interface TempToggleProps{
    unit: "C" | "F";
    onChange: (unit: "C" | "F") => void;
}
const TempToggle = ({ unit, onChange }: TempToggleProps) => {
    return (
        <div className="flex">
            <button
                onClick={() => {
                    const newUnit = unit === "C" ? "F" : "C";
                    onChange(newUnit);
                }}
                className="px-3 py-1 rounded bg-spring-green-400 hover:bg-spring-green-700 dark:hover:bg-spring-green-400 text-black hover:text-white dark:text-white dark:hover:text-black transition"
            >        °{unit === "C" ? "F" : "C"}

            </button> </div>
)

}    
export default TempToggle