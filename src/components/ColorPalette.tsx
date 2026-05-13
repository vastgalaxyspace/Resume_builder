export function ColorPalette() {
  const colors = [
    { name: 'Background', hex: '#0A0A0F', var: 'bg-[#0A0A0F]' },
    { name: 'Card', hex: '#111118', var: 'bg-[#111118]' },
    { name: 'Elevated', hex: '#1A1A24', var: 'bg-[#1A1A24]' },
    { name: 'Border', hex: '#1E1E2E', var: 'border-[#1E1E2E]' },
    { name: 'Blue', hex: '#4F8EF7', var: 'text-[#4F8EF7]' },
    { name: 'Purple', hex: '#7C5CFC', var: 'text-[#7C5CFC]' },
    { name: 'Success', hex: '#22C55E', var: 'text-[#22C55E]' },
    { name: 'Warning', hex: '#F59E0B', var: 'text-[#F59E0B]' },
    { name: 'Danger', hex: '#EF4444', var: 'text-[#EF4444]' },
    { name: 'Primary Text', hex: '#F0F0F5', var: 'text-[#F0F0F5]' },
    { name: 'Secondary Text', hex: '#8888A0', var: 'text-[#8888A0]' },
    { name: 'Muted', hex: '#44445A', var: 'text-[#44445A]' },
  ];

  const typography = [
    { name: 'Display', size: '48px', weight: '600', example: 'Get hired faster.' },
    { name: 'Heading 1', size: '36px', weight: '600', example: 'Resume Analysis' },
    { name: 'Heading 2', size: '24px', weight: '600', example: 'What To Add / Improve' },
    { name: 'Body', size: '16px', weight: '400', example: 'Your resume shows strong ML fundamentals' },
    { name: 'Small', size: '14px', weight: '400', example: 'Usually takes 20–30 seconds' },
    { name: 'Code', size: '14px', weight: '500', example: 'MLflow · Kubernetes · Spark', mono: true },
  ];

  return (
    <div className="mt-16 space-y-8">
      <div>
        <h3 className="text-[#F0F0F5] mb-4">Color Palette</h3>
        <div className="grid grid-cols-6 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div
                className="h-16 rounded-lg border border-[#1E1E2E]"
                style={{ backgroundColor: color.hex }}
              ></div>
              <div className="text-xs">
                <div className="text-[#F0F0F5]">{color.name}</div>
                <div className="text-[#8888A0] font-mono">{color.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[#F0F0F5] mb-4">Typography Scale</h3>
        <div className="space-y-4 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6">
          {typography.map((type) => (
            <div key={type.name} className="flex items-baseline gap-6 pb-4 border-b border-[#1E1E2E] last:border-0">
              <div className="w-32 flex-shrink-0">
                <div className="text-sm text-[#8888A0]">{type.name}</div>
                <div className="text-xs text-[#44445A] font-mono">
                  {type.size} / {type.weight}
                </div>
              </div>
              <div
                className="text-[#F0F0F5]"
                style={{
                  fontSize: type.size,
                  fontWeight: type.weight,
                  fontFamily: type.mono ? 'monospace' : 'inherit',
                }}
              >
                {type.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-8 border-t border-[#1E1E2E]">
        <p className="text-sm text-[#44445A]">
          Design System: Inter font · 16px border-radius · Glassmorphism cards · Subtle animations
        </p>
      </div>
    </div>
  );
}