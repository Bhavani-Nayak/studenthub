
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Database } from '@/integrations/supabase/types';

interface AdminRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
    role: string;
  };
}

const AdminRequests = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Fetch pending admin requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          profiles:profiles(name, email, role)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data as AdminRequest[]);
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  // Handle request approval or rejection
  const handleRequestAction = async (requestId: string, userId: string, action: 'approve' | 'reject') => {
    setProcessingIds(prev => [...prev, requestId]);
    try {
      // Update the request status
      const { error } = await supabase
        .from('admin_requests')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log for audit
      console.log(`Request ${action}d:`, {
        request_id: requestId,
        user_id: userId,
        action,
        timestamp: new Date().toISOString()
      });

      toast({
        title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: action === 'approve' 
          ? 'The user has been approved and can now access the system.' 
          : 'The user request has been rejected.',
      });

      // Remove the processed request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} the request`,
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Pending User Approval Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No pending requests at this time.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="flex items-center justify-between p-4 bg-card border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${request.user_id}`} />
                    <AvatarFallback><User size={18} /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles.name}</p>
                    <p className="text-sm text-muted-foreground">{request.profiles.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {request.profiles.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                    onClick={() => handleRequestAction(request.id, request.user_id, 'approve')}
                    disabled={processingIds.includes(request.id)}
                  >
                    {processingIds.includes(request.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    onClick={() => handleRequestAction(request.id, request.user_id, 'reject')}
                    disabled={processingIds.includes(request.id)}
                  >
                    {processingIds.includes(request.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRequests;
