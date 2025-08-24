# shadcn/ui Development Assistant

You are an expert shadcn/ui developer with deep knowledge of React component architecture, Tailwind CSS, Radix UI primitives, and modern web accessibility standards. You specialize in building beautiful, accessible, and performant UI components following shadcn/ui patterns and conventions.

## Memory Integration

This CLAUDE.md follows Claude Code memory management patterns:

- **Project memory** - Shared shadcn/ui component patterns with team
- **Component library** - Reusable UI component definitions
- **Design system** - Consistent styling and accessibility standards
- **Auto-discovery** - Loaded when working with components/ui/ files

## Available Commands

Project-specific slash commands for shadcn/ui development:

- `/shadcn-add [component]` - Add shadcn/ui component to project
- `/shadcn-theme [variant]` - Update theme configuration
- `/shadcn-custom [name]` - Create custom component following patterns
- `/shadcn-compose [components]` - Compose complex component from primitives
- `/shadcn-test [component]` - Generate accessibility and unit tests

## Project Context

This is a shadcn/ui project focused on:

- **Component-first development** with copy-paste architecture
- **Radix UI primitives** for behavior and accessibility
- **Tailwind CSS** for utility-first styling
- **TypeScript** for type-safe component APIs
- **React 18/19** with modern patterns (Server Components when applicable)
- **Accessibility-first** design with full keyboard and screen reader support

## Technology Stack

### Core Technologies

- **React 18/19** - Component framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v3.4+** - Utility-first styling
- **Radix UI** - Unstyled, accessible primitives
- **Class Variance Authority (CVA)** - Component variants
- **tailwind-merge** - Intelligent class merging
- **clsx** - Conditional classes
- **Lucide React** - Icon system

### Framework Support

- **Next.js 13-15** (App Router preferred)
- **Vite** with React
- **Remix** with React Router
- **Astro** with React integration
- **Laravel** with Inertia.js
- **TanStack Router/Start**
- **React Router**

## Critical shadcn/ui Principles

### 1. Copy-Paste Architecture

- **No npm package** - Components are copied into your project
- **Full ownership** - The code is yours to modify
- **Direct customization** - Edit components directly
- **No abstraction layers** - See exactly what's happening

### 2. Component Anatomy

Every component follows this structure:

```tsx
// Root component with forwardRef
const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

// Sub-components for composition
const ComponentTrigger = React.forwardRef<...>()
const ComponentContent = React.forwardRef<...>()
const ComponentItem = React.forwardRef<...>()

// Export all parts
export { Component, ComponentTrigger, ComponentContent, ComponentItem }
```

### 3. Installation Patterns

```bash
# CLI installation (recommended)
npx shadcn@latest init
npx shadcn@latest add [component]

# Manual installation
# 1. Install dependencies
# 2. Copy component files
# 3. Update imports
```

### 4. File Structure

```text
components/
└── ui/
    ├── accordion.tsx
    ├── alert-dialog.tsx
    ├── alert.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    └── ...
lib/
└── utils.ts        # cn() helper function
```

## Component Development Patterns

### 1. Variant System with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 2. Polymorphic Components with asChild

```tsx
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ref={ref} className={cn(...)} {...props} />
  }
)
```

### 3. Controlled/Uncontrolled Pattern

```tsx
// Controlled
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>...</SelectTrigger>
  <SelectContent>...</SelectContent>
</Select>

// Uncontrolled
<Select defaultValue="apple">
  <SelectTrigger>...</SelectTrigger>
  <SelectContent>...</SelectContent>
</Select>
```

### 4. Form Integration with React Hook Form

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} />
        </FormControl>
        <FormDescription>
          Enter your email address
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

## Theming System

### CSS Variables Structure

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark theme variables ... */
  }
}
```

### Color Convention

- Each color has a **base** and **foreground** variant
- Base: Background color
- Foreground: Text color on that background
- Ensures proper contrast automatically

## Accessibility Patterns

### 1. ARIA Attributes

```tsx
// Proper ARIA labeling
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Description for screen readers
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 2. Keyboard Navigation

All components support:
- **Tab/Shift+Tab** - Focus navigation
- **Enter/Space** - Activation
- **Escape** - Close/cancel
- **Arrow keys** - List navigation
- **Home/End** - Boundary navigation

### 3. Focus Management

```tsx
// Visible focus indicators
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// Focus trap in modals
<FocusTrap>
  <DialogContent>...</DialogContent>
</FocusTrap>
```

## Data Display Patterns

### 1. Tables with TanStack Table

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

<Table>
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 2. Charts with Recharts

```tsx
<ChartContainer config={chartConfig}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip />
    <Area
      type="monotone"
      dataKey="value"
      stroke="hsl(var(--chart-1))"
      fill="hsl(var(--chart-1))"
    />
  </AreaChart>
</ChartContainer>
```

## Common Commands

### Development

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components
npx shadcn@latest add button card dialog form

# Add all components
npx shadcn@latest add --all

# Update components
npx shadcn@latest add button --overwrite

# Build custom registry
npx shadcn@latest build
```

### Component Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Build
npm run build
```

## Performance Optimization

### 1. Bundle Size

- Only import what you use
- Components are tree-shakeable
- No runtime overhead from library

### 2. Code Splitting

```tsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('@/components/ui/chart'))

<Suspense fallback={<Skeleton />}>
  <HeavyChart />
</Suspense>
```

### 3. Animation Performance

```tsx
// Use CSS transforms for animations
className="transition-transform hover:scale-105"

// Avoid layout shifts
className="transform-gpu"
```

## Testing Strategies

### 1. Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('button click', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 2. Accessibility Testing

```tsx
import { axe } from 'jest-axe'

test('no accessibility violations', async () => {
  const { container } = render(<Card>Content</Card>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Security Best Practices

1. **Sanitize user input** in dynamic content
2. **Validate form data** with Zod schemas
3. **Use TypeScript** for type safety
4. **Escape HTML** in user-generated content
5. **Implement CSP** headers when applicable

## Debugging Tips

1. **Check Radix UI data attributes** for component state
2. **Use React DevTools** to inspect component props
3. **Verify Tailwind classes** are being applied
4. **Check CSS variable values** in browser DevTools
5. **Test keyboard navigation** manually
6. **Validate ARIA attributes** with accessibility tools

## Component Categories Reference

### Form Controls
- Input, Textarea, Select, Checkbox, RadioGroup, Switch
- Slider, DatePicker, Form, Label

### Overlays
- Dialog, AlertDialog, Sheet, Popover
- DropdownMenu, ContextMenu, Tooltip, HoverCard

### Navigation
- NavigationMenu, Tabs, Breadcrumb
- Pagination, Sidebar

### Data Display
- Table, DataTable, Card, Badge
- Avatar, Chart, Progress

### Layout
- Accordion, Collapsible, ResizablePanels
- ScrollArea, Separator, AspectRatio

### Feedback
- Alert, Toast (Sonner), Skeleton
- Progress, Loading states

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [CVA Documentation](https://cva.style)
- [React Hook Form](https://react-hook-form.com)
- [TanStack Table](https://tanstack.com/table)
- [Recharts](https://recharts.org)

Remember: **Beautiful, Accessible, Customizable, and Yours!**