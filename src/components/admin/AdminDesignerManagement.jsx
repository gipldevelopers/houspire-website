import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Users, Plus, Edit, Star, MapPin, Briefcase, CheckCircle, XCircle, Search, } from 'lucide-react';
export default function AdminDesignerManagement() {
    const { toast } = useToast();
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    useEffect(() => {
        fetchDesigners();
    }, [filterStatus]);
    const fetchDesigners = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('designer_profiles')
                .select('id, full_name, display_name, city, country, primary_specialty, projects_completed, rating, is_available, is_featured, status')
                .order('is_featured', { ascending: false })
                .order('rating', { ascending: false });
            if (filterStatus !== 'all') {
                query = query.eq('status', filterStatus);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            setDesigners(data || []);
        }
        catch (error) {
            console.error('Error fetching designers:', error);
            toast({
                title: 'Error loading designers',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const toggleFeatured = async (designerId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('designer_profiles')
                .update({ is_featured: !currentStatus })
                .eq('id', designerId);
            if (error)
                throw error;
            toast({
                title: 'Success',
                description: `Designer ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
            });
            fetchDesigners();
        }
        catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const toggleAvailability = async (designerId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('designer_profiles')
                .update({ is_available: !currentStatus })
                .eq('id', designerId);
            if (error)
                throw error;
            toast({
                title: 'Success',
                description: `Designer availability updated`,
            });
            fetchDesigners();
        }
        catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const toggleStatus = async (designerId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const { error } = await supabase
                .from('designer_profiles')
                .update({ status: newStatus })
                .eq('id', designerId);
            if (error)
                throw error;
            toast({
                title: 'Success',
                description: `Designer ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
            });
            fetchDesigners();
        }
        catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const filteredDesigners = designers.filter(designer => designer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designer.primary_specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Designer Management</h2>
          <p className="text-muted-foreground">
            Manage {designers.length} designer profiles
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="w-4 h-4 mr-2"/>
          Add Designer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4"/>
            Total
          </div>
          <p className="text-2xl font-bold">{designers.length}</p>
          <p className="text-xs text-muted-foreground">Total Designers</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Star className="w-4 h-4 text-amber-500"/>
            Featured
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {designers.filter(d => d.is_featured).length}
          </p>
          <p className="text-xs text-muted-foreground">Featured Designers</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="w-4 h-4 text-green-500"/>
            Available
          </div>
          <p className="text-2xl font-bold text-green-600">
            {designers.filter(d => d.is_available).length}
          </p>
          <p className="text-xs text-muted-foreground">Currently Available</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Briefcase className="w-4 h-4"/>
            Projects
          </div>
          <p className="text-2xl font-bold">
            {designers.reduce((sum, d) => sum + d.projects_completed, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Projects</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search designers..." className="pl-10"/>
          </div>

          {/* Status Filter */}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-input rounded-lg bg-background">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Designers Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (<TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"/>
                  </TableCell>
                </TableRow>) : filteredDesigners.length === 0 ? (<TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No designers found
                  </TableCell>
                </TableRow>) : (filteredDesigners.map((designer) => (<TableRow key={designer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{designer.full_name}</p>
                        <p className="text-sm text-muted-foreground">{designer.display_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5"/>
                        {designer.city}, {designer.country}
                      </div>
                    </TableCell>
                    <TableCell>{designer.primary_specialty}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current"/>
                          {Number(designer.rating).toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5"/>
                          {designer.projects_completed}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {designer.is_featured && (<Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Featured</Badge>)}
                        {designer.is_available ? (<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>) : (<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Unavailable</Badge>)}
                        <Badge variant={designer.status === 'active' ? 'default' : 'secondary'}>
                          {designer.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(designer.id, designer.is_featured)} title={designer.is_featured ? 'Unfeature' : 'Feature'} className="h-8 w-8">
                          <Star className={`w-4 h-4 ${designer.is_featured ? 'text-amber-500 fill-current' : ''}`}/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleAvailability(designer.id, designer.is_available)} title="Toggle Availability" className="h-8 w-8">
                          {designer.is_available ? (<CheckCircle className="w-4 h-4 text-green-500"/>) : (<XCircle className="w-4 h-4 text-red-500"/>)}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(designer.id, designer.status)} className="h-8 w-8">
                          <Edit className="w-4 h-4"/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>);
}
