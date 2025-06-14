import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { EnhancedSearchBar } from '@/components/EnhancedSearchBar';
import { ExploreProjectsSection } from '@/components/ExploreProjectsSection';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Users, Trophy, MessageCircle, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    window.open('https://discord.gg/CcwjJKdN', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
      <Navbar />
      
      {/* Hero Section - Improved */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Where Great Projects Begin</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent mb-8 leading-tight">
              Build. Collaborate.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Showcase.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join a community of developers, designers, and creators building real-world projects. 
              Form teams, share ideas, and create a verified portfolio that stands out.
            </p>

            {/* Enhanced Search Bar - Better Sizing */}
            <div className="max-w-3xl mx-auto mb-12">
              <EnhancedSearchBar 
                onSelectProject={(project) => navigate(`/project/${project.id}`)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <Link to="/create-project">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg">
                    <Plus className="w-6 h-6 mr-3" />
                    Submit Your Project
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg">
                    <Rocket className="w-6 h-6 mr-3" />
                    Get Started
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleJoinCommunity}
                className="border-2 border-purple-300/60 dark:border-purple-700/60 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-lg"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Improved */}
      <section className="py-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-y border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-8 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-3xl mb-6 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800/40 dark:group-hover:to-blue-700/40 transition-all duration-300 shadow-lg">
                <Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">{projects.length}+</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Active Projects</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-8 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-3xl mb-6 group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800/40 dark:group-hover:to-purple-700/40 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">500+</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Developers</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-8 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl mb-6 group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800/40 dark:group-hover:to-green-700/40 transition-all duration-300 shadow-lg">
                <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">{projects.filter(p => p.status === 'completed').length}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects - Better Grid */}
      <section id="featured-projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Featured Projects</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Trending Projects
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Discover exciting projects looking for collaborators. Join a team and start building something amazing.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 animate-pulse">
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore Projects Section */}
      <ExploreProjectsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join our community of builders and start collaborating on projects that matter. 
              Your next career opportunity might be just one project away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <Link to="/create-project">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg">
                    <Plus className="w-6 h-6 mr-3" />
                    Create Your Project
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg">
                    <Rocket className="w-6 h-6 mr-3" />
                    Get Started Today
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleJoinCommunity}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Heart className="w-6 h-6 mr-3" />
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              ProjectNest
            </div>
            <p className="text-slate-400 mb-8 text-lg">
              Building the future of collaborative development, one project at a time.
            </p>
            <div className="text-sm text-slate-500">
              © 2025 ProjectNest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
