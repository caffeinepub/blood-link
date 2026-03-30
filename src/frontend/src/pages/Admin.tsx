import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Edit2,
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type BloodGroup, UrgencyLevel } from "../backend";
import type {
  Donor,
  DonorInput,
  RecipientRequest,
  RecipientRequestInput,
} from "../backend";
import {
  useApproveDonor,
  useApproveRecipientRequest,
  useDeleteDonor,
  useDeleteRecipientRequest,
  useGetAllDonors,
  useGetAllRecipientRequests,
  useGetPendingDonors,
  useGetPendingRecipientRequests,
  useRejectDonor,
  useRejectRecipientRequest,
  useUpdateDonor,
  useUpdateRecipientRequest,
} from "../hooks/useQueries";
import { BLOOD_GROUP_DISPLAY, BLOOD_GROUP_OPTIONS } from "../lib/bloodGroup";

const ADMIN_PASSWORD = "2106";

const URGENCY_OPTIONS = [
  { value: UrgencyLevel.Low, label: "Low" },
  { value: UrgencyLevel.Medium, label: "Medium" },
  { value: UrgencyLevel.High, label: "High" },
  { value: UrgencyLevel.Critical, label: "Critical" },
];

function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const colorMap: Record<UrgencyLevel, string> = {
    [UrgencyLevel.Critical]: "bg-red-100 text-red-800 border-red-200",
    [UrgencyLevel.High]: "bg-orange-100 text-orange-800 border-orange-200",
    [UrgencyLevel.Medium]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [UrgencyLevel.Low]: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[level]}`}
    >
      {level}
    </span>
  );
}

function EditDonorDialog({
  donor,
  open,
  onClose,
}: { donor: Donor; open: boolean; onClose: () => void }) {
  const updateMutation = useUpdateDonor();
  const [form, setForm] = useState<DonorInput>({
    name: donor.name,
    bloodGroup: donor.bloodGroup,
    area: donor.area,
    contactInfo: donor.contactInfo,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMutation.mutateAsync({ donorId: donor.donorId, input: form });
      toast.success("Donor updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update donor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Donor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Blood Group</Label>
            <Select
              value={form.bloodGroup}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, bloodGroup: v as BloodGroup }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUP_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>City / Area</Label>
            <Input
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Contact</Label>
            <Input
              value={form.contactInfo}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactInfo: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditRecipientDialog({
  request,
  open,
  onClose,
}: { request: RecipientRequest; open: boolean; onClose: () => void }) {
  const updateMutation = useUpdateRecipientRequest();
  const [form, setForm] = useState<RecipientRequestInput>({
    patientName: request.patientName,
    requiredBloodGroup: request.requiredBloodGroup,
    hospitalName: request.hospitalName,
    urgencyLevel: request.urgencyLevel,
    area: request.area,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        requestId: request.requestId,
        input: form,
      });
      toast.success("Request updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Recipient Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Patient Name</Label>
            <Input
              value={form.patientName}
              onChange={(e) =>
                setForm((f) => ({ ...f, patientName: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Required Blood Group</Label>
            <Select
              value={form.requiredBloodGroup}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, requiredBloodGroup: v as BloodGroup }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUP_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Hospital Name</Label>
            <Input
              value={form.hospitalName}
              onChange={(e) =>
                setForm((f) => ({ ...f, hospitalName: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Urgency Level</Label>
            <Select
              value={form.urgencyLevel}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, urgencyLevel: v as UrgencyLevel }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>City / Area</Label>
            <Input
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PendingDonorRow({ donor, index }: { donor: Donor; index: number }) {
  const approveMutation = useApproveDonor();
  const rejectMutation = useRejectDonor();
  const [actionId, setActionId] = useState<"approve" | "reject" | null>(null);

  return (
    <motion.tr
      className="border-b border-border hover:bg-muted/30 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
    >
      <td className="px-4 py-3 font-medium">{donor.name}</td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="text-primary border-primary/30 bg-primary/5"
        >
          {BLOOD_GROUP_DISPLAY[donor.bloodGroup]}
        </Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{donor.area}</td>
      <td className="px-4 py-3 text-muted-foreground">{donor.contactInfo}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white h-7 px-3"
            onClick={async () => {
              setActionId("approve");
              try {
                await approveMutation.mutateAsync(donor.donorId);
                toast.success("Donor approved");
              } catch {
                toast.error("Failed");
              } finally {
                setActionId(null);
              }
            }}
            disabled={actionId !== null}
          >
            {actionId === "approve" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-3"
            onClick={async () => {
              setActionId("reject");
              try {
                await rejectMutation.mutateAsync(donor.donorId);
                toast.success("Rejected");
              } catch {
                toast.error("Failed");
              } finally {
                setActionId(null);
              }
            }}
            disabled={actionId !== null}
          >
            {actionId === "reject" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      </td>
    </motion.tr>
  );
}

function PendingRecipientRow({
  request,
  index,
}: { request: RecipientRequest; index: number }) {
  const approveMutation = useApproveRecipientRequest();
  const rejectMutation = useRejectRecipientRequest();
  const [actionId, setActionId] = useState<"approve" | "reject" | null>(null);

  return (
    <motion.tr
      className="border-b border-border hover:bg-muted/30 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
    >
      <td className="px-4 py-3 font-medium">{request.patientName}</td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="text-primary border-primary/30 bg-primary/5"
        >
          {BLOOD_GROUP_DISPLAY[request.requiredBloodGroup]}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <UrgencyBadge level={request.urgencyLevel} />
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {request.hospitalName}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{request.area}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white h-7 px-3"
            onClick={async () => {
              setActionId("approve");
              try {
                await approveMutation.mutateAsync(request.requestId);
                toast.success("Approved");
              } catch {
                toast.error("Failed");
              } finally {
                setActionId(null);
              }
            }}
            disabled={actionId !== null}
          >
            {actionId === "approve" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-3"
            onClick={async () => {
              setActionId("reject");
              try {
                await rejectMutation.mutateAsync(request.requestId);
                toast.success("Rejected");
              } catch {
                toast.error("Failed");
              } finally {
                setActionId(null);
              }
            }}
            disabled={actionId !== null}
          >
            {actionId === "reject" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      </td>
    </motion.tr>
  );
}

function ApprovedDonorRow({ donor, index }: { donor: Donor; index: number }) {
  const deleteMutation = useDeleteDonor();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
        <td className="px-4 py-3 font-medium">{donor.name}</td>
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className="text-primary border-primary/30 bg-primary/5"
          >
            {BLOOD_GROUP_DISPLAY[donor.bloodGroup]}
          </Badge>
        </td>
        <td className="px-4 py-3 text-muted-foreground">{donor.area}</td>
        <td className="px-4 py-3 text-muted-foreground">{donor.contactInfo}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 px-2"
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Delete donor "${donor.name}"?`)) return;
                setDeleting(true);
                try {
                  await deleteMutation.mutateAsync(donor.donorId);
                  toast.success("Donor deleted");
                } catch {
                  toast.error("Failed to delete");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </td>
      </tr>
      {editOpen && (
        <EditDonorDialog
          donor={donor}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

function ApprovedRecipientRow({
  request,
  index,
}: { request: RecipientRequest; index: number }) {
  const deleteMutation = useDeleteRecipientRequest();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
        <td className="px-4 py-3 font-medium">{request.patientName}</td>
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className="text-primary border-primary/30 bg-primary/5"
          >
            {BLOOD_GROUP_DISPLAY[request.requiredBloodGroup]}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <UrgencyBadge level={request.urgencyLevel} />
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {request.hospitalName}
        </td>
        <td className="px-4 py-3 text-muted-foreground">{request.area}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 px-2"
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Delete request for "${request.patientName}"?`))
                  return;
                setDeleting(true);
                try {
                  await deleteMutation.mutateAsync(request.requestId);
                  toast.success("Request deleted");
                } catch {
                  toast.error("Failed to delete");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </td>
      </tr>
      {editOpen && (
        <EditRecipientDialog
          request={request}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: pendingDonors, isLoading: pdLoading } = useGetPendingDonors();
  const { data: pendingRequests, isLoading: prLoading } =
    useGetPendingRecipientRequests();
  const { data: allDonors, isLoading: adLoading } = useGetAllDonors();
  const { data: allRequests, isLoading: arLoading } =
    useGetAllRecipientRequests();

  const pdCount = pendingDonors?.length ?? 0;
  const prCount = pendingRequests?.length ?? 0;
  const adCount = allDonors?.length ?? 0;
  const arCount = allRequests?.length ?? 0;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <div>
              <h1 className="font-display text-2xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage donors and recipient requests
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Donors",
              value: adCount,
              loading: adLoading,
              highlight: false,
            },
            {
              label: "Total Requests",
              value: arCount,
              loading: arLoading,
              highlight: false,
            },
            {
              label: "Pending Donors",
              value: pdCount,
              loading: pdLoading,
              highlight: pdCount > 0,
            },
            {
              label: "Pending Requests",
              value: prCount,
              loading: prLoading,
              highlight: prCount > 0,
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className={`border ${stat.highlight ? "border-orange-300 bg-orange-50" : "border-border"}`}
            >
              <CardContent className="pt-4 pb-4 text-center">
                {stat.loading ? (
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                ) : (
                  <p
                    className={`text-3xl font-bold ${stat.highlight ? "text-orange-600" : "text-primary"}`}
                  >
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pending-donors" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending-donors">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pending Donors
              {pdCount > 0 && (
                <Badge className="ml-1.5 bg-orange-500 text-white text-xs h-4 px-1">
                  {pdCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending-requests">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pending Requests
              {prCount > 0 && (
                <Badge className="ml-1.5 bg-orange-500 text-white text-xs h-4 px-1">
                  {prCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all-donors">All Donors ({adCount})</TabsTrigger>
            <TabsTrigger value="all-requests">
              All Requests ({arCount})
            </TabsTrigger>
          </TabsList>

          {/* Pending Donors Tab */}
          <TabsContent value="pending-donors">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" /> Pending Donor
                  Approvals
                  <span className="text-sm font-normal text-muted-foreground">
                    (newest first)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {pdLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : pdCount === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">No pending donors</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All submissions have been reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-4 py-2.5 text-left font-medium">
                            Name
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Blood Group
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            City
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Contact
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDonors?.map((donor, i) => (
                          <PendingDonorRow
                            key={donor.donorId.toString()}
                            donor={donor}
                            index={i}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending-requests">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" /> Pending
                  Recipient Approvals
                  <span className="text-sm font-normal text-muted-foreground">
                    (newest first)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {prLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : prCount === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">No pending requests</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All submissions have been reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-4 py-2.5 text-left font-medium">
                            Patient
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Blood Group
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Urgency
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Hospital
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            City
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests?.map((req, i) => (
                          <PendingRecipientRow
                            key={req.requestId.toString()}
                            request={req}
                            index={i}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Donors Tab */}
          <TabsContent value="all-donors">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">All Donors Database</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {adLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : adCount === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No donors in database.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-4 py-2.5 text-left font-medium">
                            #
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Name
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Blood Group
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            City
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Contact
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allDonors?.map((donor, i) => (
                          <ApprovedDonorRow
                            key={donor.donorId.toString()}
                            donor={donor}
                            index={i}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Requests Tab */}
          <TabsContent value="all-requests">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  All Recipient Requests Database
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {arLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : arCount === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No requests in database.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-4 py-2.5 text-left font-medium">
                            #
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Patient
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Blood Group
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Urgency
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Hospital
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            City
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRequests?.map((req, i) => (
                          <ApprovedRecipientRow
                            key={req.requestId.toString()}
                            request={req}
                            index={i}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (isLoggedIn) {
    return (
      <AdminDashboard
        onLogout={() => {
          setIsLoggedIn(false);
          setPassword("");
        }}
      />
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">
              Admin Portal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your password to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
