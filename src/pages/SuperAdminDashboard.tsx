import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Crown, Building2, Users, Plus, Edit, Trash2, LogOut, Lock, Sparkles, MapPin } from 'lucide-react';

interface ParkingArea {
  area_id: string;
  name: string;
  location: string;
  total_slots: number;
  active: boolean;
  created_at: string;
  created_by: string;
}

interface Admin {
  email: string;
  name: string;
  role: string;
  parking_area_id: string;
  parking_area_name: string;
  created_at: string;
  password_changed: boolean;
  status: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Parking Area Form State
  const [newArea, setNewArea] = useState({
    area_id: '',
    name: '',
    location: '',
    total_slots: 50,
  });

  // Admin Form State
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    parking_area_id: '',
  });

  const [editingArea, setEditingArea] = useState<ParkingArea | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showAreaDialog, setShowAreaDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const superAdminData = JSON.parse(localStorage.getItem('super_admin_data') || '{}');
  const token = localStorage.getItem('super_admin_token');

  useEffect(() => {
    // Check authentication
    if (!token) {
      navigate('/super-admin/login');
      return;
    }

    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch parking areas and admins in parallel
      const [areasRes, adminsRes] = await Promise.all([
        fetch('http://localhost:8011/api/super-admin/parking-areas', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:8011/api/super-admin/admins', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const areasData = await areasRes.json();
      const adminsData = await adminsRes.json();

      if (areasData.success) setParkingAreas(areasData.parking_areas);
      if (adminsData.success) setAdmins(adminsData.admins);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    localStorage.removeItem('super_admin_data');
    navigate('/super-admin/login');
  };

  const handleCreateArea = async () => {
    try {
      const response = await fetch('http://localhost:8011/api/super-admin/parking-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newArea),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Parking area created successfully!');
        setShowAreaDialog(false);
        setNewArea({ area_id: '', name: '', location: '', total_slots: 50 });
        fetchData();
      } else {
        setError(data.error || 'Failed to create parking area');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const handleUpdateArea = async () => {
    if (!editingArea) return;

    try {
      const response = await fetch(`http://localhost:8011/api/super-admin/parking-areas/${editingArea.area_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingArea.name,
          location: editingArea.location,
          total_slots: editingArea.total_slots,
          active: editingArea.active,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Parking area updated successfully!');
        setEditingArea(null);
        fetchData();
      } else {
        setError(data.error || 'Failed to update parking area');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    if (!confirm('Are you sure you want to delete this parking area? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8011/api/super-admin/parking-areas/${areaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Parking area deleted successfully!');
        fetchData();
      } else {
        setError(data.error || 'Failed to delete parking area');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8011/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Admin created! Default password: ${data.default_password}`);
        setShowAdminDialog(false);
        setNewAdmin({ email: '', name: '', parking_area_id: '' });
        fetchData();
      } else {
        setError(data.error || 'Failed to create admin');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    try {
      const response = await fetch(`http://localhost:8011/api/super-admin/admins/${editingAdmin.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingAdmin.name,
          parking_area_id: editingAdmin.parking_area_id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Admin updated successfully!');
        setEditingAdmin(null);
        fetchData();
      } else {
        setError(data.error || 'Failed to update admin');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8011/api/super-admin/admins/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Admin deleted successfully!');
        fetchData();
      } else {
        setError(data.error || 'Failed to delete admin');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-white text-2xl animate-pulse">Loading supreme control...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-none shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Super Admin Dashboard
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Welcome back, {superAdminData.name || superAdminData.email}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/super-admin/change-password')}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Parking Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-400">{parkingAreas.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-indigo-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-indigo-400">{admins.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500 bg-green-950/50 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs defaultValue="parking-areas" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger value="parking-areas" className="data-[state=active]:bg-purple-600">
              <Building2 className="w-4 h-4 mr-2" />
              Parking Areas
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-indigo-600">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
          </TabsList>

          {/* Parking Areas Tab */}
          <TabsContent value="parking-areas">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Parking Areas Management</CardTitle>
                  <Dialog open={showAreaDialog} onOpenChange={setShowAreaDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Parking Area
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-500/50">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Parking Area</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Add a new parking area to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Area ID</Label>
                          <Input
                            placeholder="PA002"
                            value={newArea.area_id}
                            onChange={(e) => setNewArea({ ...newArea, area_id: e.target.value.toUpperCase() })}
                            className="bg-slate-800 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Name</Label>
                          <Input
                            placeholder="North Parking"
                            value={newArea.name}
                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            className="bg-slate-800 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Location</Label>
                          <Input
                            placeholder="Building A, Floor 1"
                            value={newArea.location}
                            onChange={(e) => setNewArea({ ...newArea, location: e.target.value })}
                            className="bg-slate-800 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Total Slots</Label>
                          <Input
                            type="number"
                            placeholder="50"
                            value={newArea.total_slots}
                            onChange={(e) => setNewArea({ ...newArea, total_slots: parseInt(e.target.value) })}
                            className="bg-slate-800 border-purple-500/30 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateArea} className="bg-purple-600 hover:bg-purple-700">
                          Create Area
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/30">
                      <TableHead className="text-purple-300">Area ID</TableHead>
                      <TableHead className="text-purple-300">Name</TableHead>
                      <TableHead className="text-purple-300">Location</TableHead>
                      <TableHead className="text-purple-300">Slots</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkingAreas.map((area) => (
                      <TableRow key={area.area_id} className="border-purple-500/20">
                        <TableCell className="text-white font-mono">{area.area_id}</TableCell>
                        <TableCell className="text-white">{area.name}</TableCell>
                        <TableCell className="text-slate-300">{area.location || '-'}</TableCell>
                        <TableCell className="text-white">{area.total_slots}</TableCell>
                        <TableCell>
                          <Badge variant={area.active ? 'default' : 'secondary'}>
                            {area.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingArea(area)}
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-950"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteArea(area.area_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins">
            <Card className="bg-slate-800/50 border-indigo-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Admins Management</CardTitle>
                  <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-indigo-500/50">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Admin</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Add a new admin and assign to a parking area
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Email</Label>
                          <Input
                            type="email"
                            placeholder="admin@example.com"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            className="bg-slate-800 border-indigo-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Name</Label>
                          <Input
                            placeholder="Admin Name"
                            value={newAdmin.name}
                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                            className="bg-slate-800 border-indigo-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Parking Area</Label>
                          <Select
                            value={newAdmin.parking_area_id}
                            onValueChange={(value) => setNewAdmin({ ...newAdmin, parking_area_id: value })}
                          >
                            <SelectTrigger className="bg-slate-800 border-indigo-500/30 text-white">
                              <SelectValue placeholder="Select parking area" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-indigo-500/50">
                              {parkingAreas.map((area) => (
                                <SelectItem key={area.area_id} value={area.area_id} className="text-white">
                                  {area.area_id} - {area.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateAdmin} className="bg-indigo-600 hover:bg-indigo-700">
                          Create Admin
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-indigo-500/30">
                      <TableHead className="text-indigo-300">Email</TableHead>
                      <TableHead className="text-indigo-300">Name</TableHead>
                      <TableHead className="text-indigo-300">Parking Area</TableHead>
                      <TableHead className="text-indigo-300">Password Changed</TableHead>
                      <TableHead className="text-indigo-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.email} className="border-indigo-500/20">
                        <TableCell className="text-white font-mono">{admin.email}</TableCell>
                        <TableCell className="text-white">{admin.name}</TableCell>
                        <TableCell className="text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            {admin.parking_area_id} - {admin.parking_area_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.password_changed ? 'default' : 'destructive'}>
                            {admin.password_changed ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAdmin(admin)}
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-950"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAdmin(admin.email)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Area Dialog */}
        {editingArea && (
          <Dialog open={!!editingArea} onOpenChange={() => setEditingArea(null)}>
            <DialogContent className="bg-slate-900 border-purple-500/50">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Parking Area</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Name</Label>
                  <Input
                    value={editingArea.name}
                    onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Location</Label>
                  <Input
                    value={editingArea.location}
                    onChange={(e) => setEditingArea({ ...editingArea, location: e.target.value })}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Total Slots</Label>
                  <Input
                    type="number"
                    value={editingArea.total_slots}
                    onChange={(e) => setEditingArea({ ...editingArea, total_slots: parseInt(e.target.value) })}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateArea} className="bg-purple-600 hover:bg-purple-700">
                  Update Area
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Admin Dialog */}
        {editingAdmin && (
          <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
            <DialogContent className="bg-slate-900 border-indigo-500/50">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Name</Label>
                  <Input
                    value={editingAdmin.name}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                    className="bg-slate-800 border-indigo-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Parking Area</Label>
                  <Select
                    value={editingAdmin.parking_area_id}
                    onValueChange={(value) => setEditingAdmin({ ...editingAdmin, parking_area_id: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-indigo-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-indigo-500/50">
                      {parkingAreas.map((area) => (
                        <SelectItem key={area.area_id} value={area.area_id} className="text-white">
                          {area.area_id} - {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateAdmin} className="bg-indigo-600 hover:bg-indigo-700">
                  Update Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
