import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { MinimalTiptapEditor } from "../minimal-tiptap"

interface Props {
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  defaultValue?: string
  className?: string
  optional?: boolean
}

const TextEditorElement = ({
  name,
  label,
  description,
  className,
  optional,
}: Props) => {
  const { control, formState } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && (
            <FormLabel>
              {label}{" "}
              <span className="text-secondary">{optional && "(optional)"}</span>
            </FormLabel>
          )}
          <FormControl>
            <MinimalTiptapEditor
              {...field}
              onValueChange={field.onChange}
              className={cn("w-full border-black", {
                "border-red-500 focus-within:border-red-500":
                  formState.errors.description,
              })}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-[#DC2625]" />
        </FormItem>
      )}
    />
  )
}

export default TextEditorElement
