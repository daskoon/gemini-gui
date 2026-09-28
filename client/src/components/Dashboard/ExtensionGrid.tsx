import { EXTENSIONS } from '../../config/extensions';
import type { Extension } from '../../config/extensions';

interface ExtensionGridProps {
  onSelect: (ext: Extension) => void;
  projectInfo?: { name: string; version: string; branch: string };
}

export const ExtensionGrid = ({ onSelect, projectInfo }: ExtensionGridProps) => {
  const categories = {
    dev: 'Development',
    ops: 'Operations & Cloud',
    design: 'Design & UI',
    utility: 'Tools & Utilities'
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8">
      <div className="text-center py-8 relative">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9f] to-[#00d0ff] mb-2">
          Command Center
        </h2>
        <p className="text-gray-400 mb-4">Select a tool to launch its control panel</p>
        
        {projectInfo && (
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-[#00ff9f]/5 border border-[#00ff9f]/10 backdrop-blur-sm">
            <span className="text-xs font-mono text-[#00ff9f]">
              {projectInfo.name} <span className="opacity-50">v{projectInfo.version}</span>
            </span>
            <div className="w-px h-3 bg-[#00ff9f]/20" />
            <span className="text-xs font-mono text-[#00ff9f]/70">
              {projectInfo.branch}
            </span>
          </div>
        )}
      </div>

      {(Object.keys(categories) as Array<keyof typeof categories>).map((cat) => {
        const catExtensions = EXTENSIONS.filter(e => e.category === cat);
        if (catExtensions.length === 0) return null;

        return (
          <div key={cat} className="space-y-4">
            <h3 className="text-sm font-bold text-[#00ff9f]/40 uppercase tracking-widest pl-1">
              {categories[cat]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {catExtensions.map((ext) => (
                <button
                  key={ext.id}
                  onClick={() => onSelect(ext)}
                  className="group flex flex-col items-center p-6 rounded-xl border border-[#00ff9f]/10 bg-[#0d0d0d] hover:border-[#00ff9f]/40 hover:bg-[#00ff9f]/5 transition-all duration-300"
                >
                  <div className="mb-4 p-3 rounded-full bg-[#00ff9f]/5 text-[#00ff9f] group-hover:scale-110 transition-transform">
                    <ext.icon size={24} />
                  </div>
                  <span className="font-bold text-gray-200 group-hover:text-white mb-1">
                    {ext.name}
                  </span>
                  <span className="text-xs text-center text-gray-500 group-hover:text-gray-400">
                    {ext.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
