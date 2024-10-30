// app/inventory/layout.tsx
export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='h-full bg-background'>{children}</div>;
}
