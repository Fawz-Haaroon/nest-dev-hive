
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProject } from '@/hooks/useProjects';
import { X, Plus } from 'lucide-react';

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createProject = useCreateProject();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    difficulty: '',
    status: 'open',
    max_members: 5,
    repository_url: '',
    live_demo_url: '',
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.difficulty) {
      return;
    }

    await createProject.mutateAsync({
      ...formData,
      difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
      status: formData.status as 'open' | 'in_progress' | 'completed' | 'paused',
      tags,
      tech_stack: techStack,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Project</h1>
          <p className="text-slate-600">Share your project idea and find collaborators</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max_members">Maximum Team Members *</Label>
                  <Select 
                    value={formData.max_members.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, max_members: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 members</SelectItem>
                      <SelectItem value="3">3 members</SelectItem>
                      <SelectItem value="4">4 members</SelectItem>
                      <SelectItem value="5">5 members</SelectItem>
                      <SelectItem value="6">6 members</SelectItem>
                      <SelectItem value="8">8 members</SelectItem>
                      <SelectItem value="10">10 members</SelectItem>
                      <SelectItem value="15">15 members</SelectItem>
                      <SelectItem value="20">20 members</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-500">Including yourself as the project owner</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="Add technology"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    />
                    <Button type="button" onClick={addTech} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techStack.map(tech => (
                      <Badge key={tech} variant="outline" className="flex items-center gap-1">
                        {tech}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTech(tech)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="repository_url">Repository URL</Label>
                  <Input
                    id="repository_url"
                    type="url"
                    value={formData.repository_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, repository_url: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="live_demo_url">Live Demo URL</Label>
                  <Input
                    id="live_demo_url"
                    type="url"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, live_demo_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={createProject.isPending}>
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
