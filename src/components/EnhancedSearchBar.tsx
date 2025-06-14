
import { useState, useRef, useEffect } from 'react';
import { Search, X, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';

interface EnhancedSearchBarProps {
  onSelectProject?: (project: any) => void;
  className?: string;
}

export const EnhancedSearchBar = ({ onSelectProject, className = "" }: EnhancedSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: searchResults = [], isLoading } = useSearch(searchTerm);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (project: any) => {
    setSearchTerm('');
    setShowResults(false);
    setIsExpanded(false);
    onSelectProject?.(project);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div 
        className={`relative transition-all duration-300 ease-out ${
          isExpanded ? 'transform scale-[1.02]' : ''
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !searchTerm && setIsExpanded(false)}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
          <Input
            type="text"
            placeholder="Search projects, technologies, or team members..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
              setIsExpanded(true);
            }}
            onFocus={() => {
              setShowResults(true);
              setIsExpanded(true);
            }}
            className={`pl-12 pr-16 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:focus:ring-blue-500/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-base ${
              isExpanded ? 'shadow-2xl ring-2 ring-blue-400/10 dark:ring-blue-500/10' : ''
            }`}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setShowResults(false);
                setIsExpanded(false);
              }}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Simplified Dropdown - only shows when searching */}
        {showResults && searchTerm.length > 2 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 z-50 max-h-[400px] overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-base">Searching...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-3">
                  {searchResults.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleSelect(project)}
                      className="w-full text-left p-5 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 group mb-2"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {project.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base mb-1">
                            {project.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                            {project.description}
                          </div>
                          <div className="flex items-center gap-3">
                            {project.tags?.slice(0, 3).map((tag: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md"
                              >
                                {tag}
                              </Badge>
                            ))}
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                              <Star className="w-3 h-3" />
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <div className="text-2xl mb-3">🔍</div>
                  <p className="text-base font-medium mb-1">No projects found for "{searchTerm}"</p>
                  <p className="text-sm text-slate-400">Try different keywords</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
