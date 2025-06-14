
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSelectProject?: (project: any) => void;
}

export const SearchBar = ({ onSelectProject }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: searchResults = [], isLoading } = useSearch(searchTerm);

  const handleSelect = (project: any) => {
    setSearchTerm('');
    setShowResults(false);
    onSelectProject?.(project);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search projects, tags, technologies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showResults && searchTerm.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project)}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="font-medium text-slate-900">{project.title}</div>
                  <div className="text-sm text-slate-600 truncate">{project.description}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tags?.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500">No projects found</div>
          )}
        </div>
      )}
    </div>
  );
};
