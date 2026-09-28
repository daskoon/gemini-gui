interface ProgressBarProps {
  percent: number;
  label?: string;
}

export const ProgressBar = ({ percent, label }: ProgressBarProps) => {
  return (
    <div className="w-full max-w-md my-2">
      <div className="flex justify-between text-xs text-[#00ff9f] mb-1 font-mono">
        <span>{label || 'Progress'}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 bg-[#00ff9f]/10 rounded-full overflow-hidden border border-[#00ff9f]/20">
        <div 
          className="h-full bg-[#00ff9f] transition-all duration-300 ease-out shadow-[0_0_10px_#00ff9f]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
