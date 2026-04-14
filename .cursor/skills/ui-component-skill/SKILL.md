# Skill: Generate shadcn/ui Component

Use this skill when generating or modifying React UI components in Signal Lab.

## Component Template

All components live in `frontend/components/`. Server components by default; add `'use client'` only when using hooks or event handlers.

### shadcn Card Pattern

```tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Subtitle text</CardDescription>
      </CardHeader>
      <CardContent>
        {/* content */}
      </CardContent>
    </Card>
  );
}
```

### Form with React Hook Form + shadcn Select

```tsx
'use client';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormValues { field: string; }

export function MyForm() {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { field: 'default' } });
  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field-select">Field</Label>
        <Controller
          name="field"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="field-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
```

### Data Fetching with TanStack Query

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchMyData } from '@/lib/api';

export function MyDataComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData,
    refetchInterval: 5000,
  });
  if (isLoading) return <div className="animate-pulse h-8 bg-slate-800 rounded" />;
  if (error) return <p className="text-red-400">Error loading data</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## UI Conventions

- Dark theme only (bg-slate-900, border-slate-800, text-white/slate-400)
- Use `cn()` from `@/lib/utils` for conditional classes
- Lucide React for all icons (`import { IconName } from 'lucide-react'`)
- Skeleton loading with `animate-pulse bg-slate-800 rounded`
- Error states in `text-red-400` with border `border-red-800`
- Success states in `text-green-400` with border `border-green-800`
