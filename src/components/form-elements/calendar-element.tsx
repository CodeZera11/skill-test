
import { useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface InputElementProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  description?: string
  isOptional?: boolean
}

const CalendarElement: React.FC<InputElementProps> = ({ name, label, placeholder, description, isOptional, ...props }) => {
  const { control } = useFormContext();


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('', props.className)}>
          {label && (
            <FormLabel>
              {label}
              {isOptional && (
                <span className="text-neutral-400"> (optional)</span>
              )}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>
                      {placeholder || "Select a date"}
                    </span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                defaultMonth={field.value || new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CalendarElement