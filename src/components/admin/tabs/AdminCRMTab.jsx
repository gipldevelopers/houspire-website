import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Search, UserPlus, Mail, Phone, Send, Clock, CheckCircle, AlertCircle, Eye, } from 'lucide-react';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
export function AdminCRMTab({ projects, onRefresh }) {
    const { toast } = useToast();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    useEffect(() => {
        fetchCustomers();
    }, [projects]);
    const fetchCustomers = async () => {
        setLoading(true);
        const { data: profiles } = await appDataClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (profiles) {
            // Enrich with project data
            const enrichedCustomers = profiles.map((profile) => {
                const customerProjects = projects.filter((p) => p.user_id === profile.user_id);
                const totalSpent = customerProjects.reduce((sum, p) => sum + (p.total_paid || 0), 0);
                const lastProject = customerProjects[0];
                let status = 'inactive';
                if (customerProjects.some(p => p.current_phase < 6)) {
                    status = 'active';
                }
                if (lastProject) {
                    const daysSinceUpdate = (Date.now() - new Date(lastProject.updated_at).getTime()) / (1000 * 60 * 60 * 24);
                    if (daysSinceUpdate > 7 && status === 'active') {
                        status = 'at-risk';
                    }
                }
                return {
                    ...profile,
                    projectCount: customerProjects.length,
                    totalSpent,
                    lastActivity: lastProject?.updated_at || profile.created_at,
                    status,
                };
            });
            setCustomers(enrichedCustomers);
        }
        setLoading(false);
    };
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch = (customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (customer.phone?.includes(searchQuery) || false) ||
            (customer.city?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const handleSendEmail = () => {
        toast({
            title: 'Email sent',
            description: `Email sent to ${selectedCustomer?.full_name || 'customer'}`,
        });
        setShowEmailDialog(false);
        setEmailSubject('');
        setEmailBody('');
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200';
            case 'at-risk':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
            case 'inactive':
                return 'bg-muted text-muted-foreground';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    // CRM Stats
    const stats = {
        total: customers.length,
        active: customers.filter((c) => c.status === 'active').length,
        atRisk: customers.filter((c) => c.status === 'at-risk').length,
        inactive: customers.filter((c) => c.status === 'inactive').length,
    };
    return (<div className="space-y-6">
      {/* CRM Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              <CheckCircle className="h-5 w-5 text-emerald-600"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
              <AlertCircle className="h-5 w-5 text-amber-600"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.atRisk}</p>
              <p className="text-sm text-muted-foreground">At Risk</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, phone, or city..." className="pl-10"/>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Mail className="h-4 w-4 mr-2"/>
          Bulk Email
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading customers...
                </TableCell>
              </TableRow>) : filteredCustomers.length === 0 ? (<TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>) : (filteredCustomers.map((customer) => (<TableRow key={customer.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.user_id}`}/>
                        <AvatarFallback>
                          {customer.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.full_name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {customer.user_id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.phone && (<p className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3"/>
                          {customer.phone}
                        </p>)}
                    </div>
                  </TableCell>
                  <TableCell>{customer.city || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.projectCount || 0} projects</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{(customer.totalSpent || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.lastActivity
                ? new Date(customer.lastActivity).toLocaleDateString()
                : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status || 'inactive')}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => {
                setSelectedCustomer(customer);
                setShowEmailDialog(true);
            }}>
                        <Mail className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)))}
          </TableBody>
        </Table>
      </Card>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCustomer?.full_name || 'customer'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Email subject..."/>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Write your message..." rows={6}/>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2"/>
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
}

