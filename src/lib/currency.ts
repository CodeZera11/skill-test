const currency = {
  format: (value?: number, currencyCode = 'USD') => {
    if (value) {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: value % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2
        }).format(value)
      } catch (error) {
        console.error('Error formatting currency:', error)
        currency.format(value, 'AED')
      }
    }
  },
  formatShort: (value: number, currencyCode = 'USD') => {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      notation: 'compact',
      currency: currencyCode,
      maximumSignificantDigits: value > 1000 ? 2 : undefined
    }).format(value)
  }
}

export default currency
