
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Users, Trophy, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();

  const handleJoinCommunity = () => {
    window.open('https://discord.gg/CcwjJKdN', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4" />
              <span>Where Great Projects Begin</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent mb-6 leading-tight">
              Build. Collaborate.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Showcase.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join a community of developers, designers, and creators building real-world projects. 
              Form teams, share ideas, and create a verified portfolio that stands out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/create-project">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Submit Your Project
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleJoinCommunity}
                className="border-2 border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-y border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800/40 dark:group-hover:to-blue-700/40 transition-all duration-200">
                <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{projects.length}+</h3>
              <p className="text-slate-600 dark:text-slate-400">Active Projects</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl mb-4 group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800/40 dark:group-hover:to-purple-700/40 transition-all duration-200">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">500+</h3>
              <p className="text-slate-600 dark:text-slate-400">Developers</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl mb-4 group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800/40 dark:group-hover:to-green-700/40 transition-all duration-200">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{projects.filter(p => p.status === 'completed').length}</h3>
              <p className="text-slate-600 dark:text-slate-400">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="featured-projects" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover exciting projects looking for collaborators. Join a team and start building something amazing.
            </p>
          </div>

          <SearchFilters />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {projects.length > 6 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-slate-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View All Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join our community of builders and start collaborating on projects that matter. 
              Your next career opportunity might be just one project away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/create-project">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Create Your Project
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Get Started Today
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleJoinCommunity}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              ProjectNest
            </div>
            <p className="text-slate-400 mb-8">
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
