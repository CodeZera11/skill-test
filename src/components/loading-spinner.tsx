import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface LoadingSpinnerProps {
  className?: string
  fill?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fill, className }) => {
  const theme = useTheme()
  const isDark = theme?.theme === "dark" || theme?.systemTheme === "dark"
  
  if(isDark) {
    fill = fill ?? "#000000"
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill={fill ?? "#FFFFFF"} stroke={fill ?? "#FFFFFF"} stroke-width="2" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="0.4" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill={fill ?? "#FFFFFF"} stroke={fill ?? "#FFFFFF"} stroke-width="2" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="0.4" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill={fill ?? "#FFFFFF"} stroke={fill ?? "#FFFFFF"} stroke-width="2" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="0.4" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0" className={cn('', className)}></animate></circle></svg >
  )
}

export default LoadingSpinner