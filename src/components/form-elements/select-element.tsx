
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface SelectElementProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: string
  description?: string
  isOptional?: boolean
  options: {
    label: string
    value: string
  }[]
  triggerClassName?: string
}

const SelectElement: React.FC<SelectElementProps> = ({ name, label, placeholder, description, isOptional, options, triggerClassName, ...props }) => {
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
          <Select
            onValueChange={(v) => {
              field.onChange(v);
            }}
            value={props.value || field.value}
            defaultValue={props.defaultValue || field.value}
            disabled={props.disabled}
          >
            <FormControl className={cn('', props.className)}>
              <SelectTrigger className={cn('', triggerClassName)} ref={field.ref}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={`${option.value}`}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default SelectElement