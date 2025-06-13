
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Users, Trophy } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data for demonstration
  const featuredProjects = [
    {
      id: 1,
      title: "AI-Powered Task Manager",
      description: "A smart task management app with natural language processing for task creation and intelligent prioritization.",
      tags: ["React", "Python", "OpenAI"],
      difficulty: "Advanced",
      status: "Open",
      owner: "Sarah Chen",
      members: 3,
      upvotes: 24
    },
    {
      id: 2,
      title: "Real-time Collaboration Board",
      description: "Build a digital whiteboard with real-time collaboration features, perfect for remote teams and brainstorming sessions.",
      tags: ["Next.js", "WebSocket", "TypeScript"],
      difficulty: "Intermediate",
      status: "In Progress",
      owner: "Marcus Rodriguez",
      members: 5,
      upvotes: 18
    },
    {
      id: 3,
      title: "E-commerce Analytics Dashboard",
      description: "Create a comprehensive analytics dashboard for e-commerce businesses with real-time sales tracking and insights.",
      tags: ["Vue.js", "Node.js", "PostgreSQL"],
      difficulty: "Advanced",
      status: "Open",
      owner: "Lisa Wang",
      members: 2,
      upvotes: 31
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50">
              <Rocket className="w-4 h-4" />
              <span>Where Great Projects Begin</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
              Build. Collaborate.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Showcase.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join a community of developers, designers, and creators building real-world projects. 
              Form teams, share ideas, and create a verified portfolio that stands out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5 mr-2" />
                Submit Your Project
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200">
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm border-y border-slate-200/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-4">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">150+</h3>
              <p className="text-slate-600">Active Projects</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">500+</h3>
              <p className="text-slate-600">Developers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">89</h3>
              <p className="text-slate-600">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover exciting projects looking for collaborators. Join a team and start building something amazing.
            </p>
          </div>

          <SearchFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
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
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-medium transition-all duration-200">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              ProjectNest
            </div>
            <p className="text-slate-400 mb-8">
              Building the future of collaborative development, one project at a time.
            </p>
            <div className="text-sm text-slate-500">
              © 2024 ProjectNest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
