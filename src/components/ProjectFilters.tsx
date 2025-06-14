import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectFiltersProps {
  onFiltersChange: (filters: {
    category?: string;
    tags?: string[];
    difficulty?: string;
    status?: string;
    search?: string;
  }) => void;
  selectedCategory?: string;
}

export const ProjectFilters = ({ onFiltersChange, selectedCategory }: ProjectFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState(selectedCategory || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { id: 'web-development', name: 'Web Development', icon: '🌐' },
    { id: 'mobile-development', name: 'Mobile Development', icon: '📱' },
    { id: 'ai-machine-learning', name: 'AI & Machine Learning', icon: '🤖' },
    { id: 'blockchain', name: 'Blockchain & Web3', icon: '⛓️' },
    { id: 'game-development', name: 'Game Development', icon: '🎮' },
    { id: 'devops-cloud', name: 'DevOps & Cloud', icon: '☁️' },
    { id: 'iot-embedded', name: 'IoT & Embedded', icon: '🔌' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
    { id: 'vr-ar', name: 'VR & AR', icon: '🥽' },
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'desktop-software', name: 'Desktop Software', icon: '💻' },
    { id: 'api-backend', name: 'API & Backend', icon: '⚙️' },
    { id: 'fintech', name: 'FinTech', icon: '💳' },
    { id: 'edtech', name: 'EdTech', icon: '🎓' },
    { id: 'healthtech', name: 'HealthTech', icon: '🏥' },
    { id: 'automation', name: 'Automation', icon: '🤖' },
    { id: 'social-platform', name: 'Social Platform', icon: '👥' },
    { id: 'ecommerce', name: 'E-Commerce', icon: '🛒' },
    { id: 'productivity', name: 'Productivity Tools', icon: '📝' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' }
  ];

  const technologyTags = [
    // Frontend Technologies
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI', 'Styled Components',
    
    // Backend Technologies  
    'Node.js', 'Express.js', 'Nest.js', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET Core', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'Symfony', 'Go', 'Gin', 'Rust', 'Actix',
    
    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Cassandra', 'Neo4j', 'InfluxDB', 'Elasticsearch', 'DynamoDB', 'Firebase Firestore', 'Supabase',
    
    // Cloud & DevOps
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Nginx', 'Apache', 'Load Balancer',
    
    // Mobile Development
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin', 'Unity', 'Unreal Engine',
    
    // AI/ML Technologies
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenAI', 'Hugging Face', 'LangChain', 'Stable Diffusion', 'Computer Vision', 'NLP', 'Deep Learning',
    
    // Blockchain
    'Solidity', 'Web3.js', 'Ethers.js', 'Ethereum', 'Polygon', 'Solana', 'Smart Contracts', 'DeFi', 'NFT', 'IPFS',
    
    // Game Development
    'Unity 3D', 'Unreal Engine', 'Godot', 'C++', 'C#', 'OpenGL', 'DirectX', 'Blender', 'Maya',
    
    // Data & Analytics
    'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'Tableau', 'Power BI', 'D3.js', 'Chart.js', 'Plotly',
    
    // Other Tools
    'GraphQL', 'REST API', 'gRPC', 'WebSocket', 'OAuth', 'JWT', 'Stripe', 'PayPal', 'Twilio', 'SendGrid', 'Figma', 'Adobe XD'
  ];

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const filters = {
      ...(searchTerm && { search: searchTerm }),
      ...(category && { category }),
      ...(selectedTags.length > 0 && { tags: selectedTags }),
      ...(difficulty && { difficulty }),
      ...(status && { status })
    };
    onFiltersChange(filters);
  }, [searchTerm, category, selectedTags, difficulty, status, onFiltersChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setDifficulty('');
    setStatus('');
    setCategory('');
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || difficulty || status || category;

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="text"
              placeholder="Search projects by title, description, technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Advanced
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Categories Grid */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Project Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(category === cat.id ? '' : cat.id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  category === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs leading-tight text-center">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">🟢 Beginner</SelectItem>
                    <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                    <SelectItem value="advanced">🟠 Advanced</SelectItem>
                    <SelectItem value="expert">🔴 Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🟢 Open for Contributors</SelectItem>
                    <SelectItem value="in-progress">🟡 In Progress</SelectItem>
                    <SelectItem value="completed">✅ Completed</SelectItem>
                    <SelectItem value="closed">🔒 Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort Projects By</label>
                <Select>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Most recent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">📅 Most Recent</SelectItem>
                    <SelectItem value="popular">🔥 Most Popular</SelectItem>
                    <SelectItem value="members">👥 Most Contributors</SelectItem>
                    <SelectItem value="featured">⭐ Featured Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technology Stack Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Technology Stack</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {technologyTags.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTag(tech)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tech)
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active filters:</span>
            {category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find(c => c.id === category)?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('')} />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
              </Badge>
            ))}
            {difficulty && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {difficulty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setDifficulty('')} />
              </Badge>
            )}
            {status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {status}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setStatus('')} />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
