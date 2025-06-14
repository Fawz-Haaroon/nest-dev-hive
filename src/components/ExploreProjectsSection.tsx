
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Target, Users, Code, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExploreProjectsSection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Full-stack, frontend, and backend projects',
      count: '120+ projects',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
      categoryId: 'web-development'
    },
    {
      icon: Lightbulb,
      title: 'AI & Machine Learning',
      description: 'Cutting-edge AI projects and models',
      count: '80+ projects',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
      categoryId: 'ai-machine-learning'
    },
    {
      icon: Target,
      title: 'Mobile Development',
      description: 'iOS, Android, and cross-platform apps',
      count: '65+ projects',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      categoryId: 'mobile-development'
    },
    {
      icon: Zap,
      title: 'DevOps & Cloud',
      description: 'Infrastructure and deployment projects',
      count: '45+ projects',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
      categoryId: 'devops-cloud'
    }
  ];

  const handleExploreAll = () => {
    navigate('/explore');
  };

  const handleExploreCategory = (categoryId: string) => {
    navigate(`/explore?category=${categoryId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-blue-950/80 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Discover Amazing Projects</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent mb-6">
            Explore by Category
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Find projects that match your interests and skills. Join teams building the future.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index}
                className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br ${category.bgGradient} border-0 overflow-hidden relative`}
                onClick={() => handleExploreCategory(category.categoryId)}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardContent className="p-6 relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 backdrop-blur-sm"
                    >
                      {category.count}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              onClick={handleExploreAll}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/create-project')}
              className="border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Submit Your Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
