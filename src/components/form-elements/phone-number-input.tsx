import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTheme } from 'next-themes'
import { useFormContext } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

interface Props {
  name: string
  label: string
  description?: string
  placeholder?: string
  type?: string
}

const PhoneNumberInputElement = ({ name, label, description }: Props) => {
  const { theme } = useTheme()
  const { control } = useFormContext()

  const isDark = theme === "dark" || theme === "system"

  if (!theme) return null

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              defaultCountry="ae"
              value={field.value}
              onChange={field.onChange}
              className='border rounded-md'

              countrySelectorStyleProps={{
                buttonStyle: {
                  border: 0,
                  marginLeft: "0.3rem",
                  backgroundColor: isDark ? 'transparent' : '#fff',
                },
                style: {
                  border: 0
                }
              }}
              inputStyle={{
                width: '100%',
                background: isDark ? 'transparent' : '#fff',
                color: isDark ? '#fff' : '#000',
                border: "0",
                fontSize: '14px'
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default PhoneNumberInputElement
