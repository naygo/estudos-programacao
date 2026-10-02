import { useEffect, useId, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

interface UserSearchInputProps {
  value: string
  onDebouncedChange: (value: string) => void
  debounceMs?: number
  placeholder?: string
  label?: string
}

export function UserSearchInput({
  value,
  onDebouncedChange,
  debounceMs = 400,
  placeholder = 'Buscar por nome ou e-mail',
  label = 'Buscar usuários',
}: UserSearchInputProps) {
  const [local, setLocal] = useState(value)
  const lastExternalValueRef = useRef(value)

  // sync quando filtro externo (ex.: URL) muda sem vir deste input
  useEffect(() => {
    if (value !== lastExternalValueRef.current) {
      lastExternalValueRef.current = value
      setLocal(value)
    }
  }, [value])

  const debounced = useDebouncedValue(local, debounceMs)
  const lastEmittedRef = useRef(value)

  useEffect(() => {
    if (debounced !== lastEmittedRef.current) {
      lastEmittedRef.current = debounced
      lastExternalValueRef.current = debounced
      onDebouncedChange(debounced)
    }
  }, [debounced, onDebouncedChange])

  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="search"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder={placeholder}
          className="pl-8"
          aria-label={label}
        />
      </div>
    </div>
  )
}
