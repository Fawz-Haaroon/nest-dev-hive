
import { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, Star, Filter } from 'lucide-react';
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
  const [recentSearches] = useState(['React', 'Next.js', 'TypeScript', 'AI Project']);
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

  const handleRecentSearch = (term: string) => {
    setSearchTerm(term);
    setShowResults(true);
  };

  const popularTags = ['React', 'Python', 'JavaScript', 'AI/ML', 'Mobile', 'Web Dev'];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div 
        className={`relative transition-all duration-300 ease-out ${
          isExpanded ? 'transform scale-105' : ''
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
            className={`pl-12 pr-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:focus:ring-blue-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Dropdown */}
        {(showResults || isExpanded) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 z-50 max-h-96 overflow-hidden">
            {searchTerm.length === 0 ? (
              /* Empty State with Suggestions */
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                        onClick={() => handleRecentSearch(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full text-left p-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 text-sm text-slate-700 dark:text-slate-300"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelect(project)}
                        className="w-full text-left p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                            {project.title.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {project.title}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                              {project.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {project.tags?.slice(0, 2).map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
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
                  <div className="p-6 text-center text-slate-500">
                    <div className="text-lg mb-2">🔍</div>
                    <p className="text-sm">No projects found for "{searchTerm}"</p>
                    <p className="text-xs text-slate-400 mt-1">Try different keywords or browse popular tags</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
