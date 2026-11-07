'use client'

import * as React from 'react'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
} from '@/components/ui/select'

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  maxDisplay?: number
  searchable?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  label,
  error,
  disabled,
  maxDisplay = 3,
  searchable = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  const displayValue = value.length === 0
    ? placeholder
    : value.length <= maxDisplay
    ? value.map((v) => options.find((o) => o.value === v)?.label).join(', ')
    : `${value.length} itens selecionados`

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5">{label}</label>
      )}
      <div className="relative">
        <Select open={isOpen} onOpenChange={setIsOpen}>
          <SelectTrigger
            className={cn(
              'justify-between',
              error && 'border-destructive focus:ring-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <SelectValue placeholder={placeholder}>
              {displayValue}
            </SelectValue>
            <SelectPrimitive.Icon asChild>
              {isOpen ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
            </SelectPrimitive.Icon>
          </SelectTrigger>
          <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-96">
            {searchable && (
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <label className="flex items-center gap-2 cursor-pointer w-full">
                      <Checkbox
                        checked={value.includes(option.value)}
                        onCheckedChange={() => toggleOption(option.value)}
                        disabled={disabled}
                      />
                      <span>{option.label}</span>
                    </label>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}

import * as SelectPrimitive from '@radix-ui/react-select'

// URL input with add/remove functionality
interface UrlListProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function UrlList({
  value,
  onChange,
  label,
  placeholder = 'https://exemplo.com',
  error,
  disabled,
}: UrlListProps) {
  const [newUrl, setNewUrl] = React.useState('')

  const handleAdd = () => {
    if (newUrl.trim() && !value.includes(newUrl.trim())) {
      onChange([...value, newUrl.trim()])
      setNewUrl('')
    }
  }

  const handleRemove = (url: string) => {
    onChange(value.filter((v) => v !== url))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5">{label}</label>
      )}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="button" onClick={handleAdd} disabled={disabled || !newUrl.trim()}>
            Adicionar
          </Button>
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((url) => (
              <div key={url} className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-sm">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                  {url}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemove(url)}
                  disabled={disabled}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}