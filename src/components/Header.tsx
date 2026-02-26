import { Link } from "react-router-dom"
import { useTheme } from "./context/theme-context"
import { Moon, Sun } from "lucide-react"
import { useTemp } from "./context/tempreture-context"
import TempToggle from "./TempToggle"
import CitySearch from "./CitySearch"

export const Header = () => {
const{theme,setTheme}=useTheme()
const {unit,setUnit}=useTemp()
  const isDark = theme === "dark"

return (
  <header className="sticky top-0 z-50 w-full border-b bg:background/95 backdrop-blur py-2">
  <div className="container mx-auto flex h-16 items-center justify-between px-4 ">
    
    <Link to={"/"}>
      <img
        src={isDark ? "/logo.png" : "/logo1.png"}
        alt="Logo"
        className="h-25"
      />
    </Link>

    
      <div className="flex items-center gap-3">
        <CitySearch/>

      <div
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`flex items-center cursor-pointer transition-transform duration-500
        ${isDark ? "rotate-360" : "rotate-0"}`}
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-yellow-100 rotate-0 transition-all" />
        ) : (
          <Moon className="h-6 w-6 text-spring-green-500 rotate-0 transition-all" />
        )}
      </div>

      <TempToggle unit={unit} onChange={setUnit} />

    </div>
  </div>
</header>
  )
}
