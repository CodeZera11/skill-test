
import { useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface TextAreaElementProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  description?: string
  isOptional?: boolean
}

const TextAreaElement: React.FC<TextAreaElementProps> = ({ name, label, placeholder, description, isOptional, ...props }) => {
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
              {isOptional && <span className="text-gray-400"> (Optional)</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea {...field} {...props} placeholder={placeholder} className={cn('', props.className)} />
          </FormControl>
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

export default TextAreaElement