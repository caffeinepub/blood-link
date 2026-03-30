import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Droplets,
  HeartPulse,
  Loader2,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type BloodGroup,
  UrgencyLevel,
  useIsActorReady,
  useRegisterDonor,
  useRegisterRecipient,
} from "../hooks/useQueries";
import { BLOOD_GROUP_OPTIONS } from "../lib/bloodGroup";

const URGENCY_OPTIONS = [
  { value: UrgencyLevel.Low, label: "Low" },
  { value: UrgencyLevel.Medium, label: "Medium" },
  { value: UrgencyLevel.High, label: "High" },
  { value: UrgencyLevel.Critical, label: "Critical" },
];

function DonorForm() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [area, setArea] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [success, setSuccess] = useState(false);
  const mutation = useRegisterDonor();
  const actorReady = useIsActorReady();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup) return;
    try {
      await mutation.mutateAsync({ name, bloodGroup, area, contactInfo });
      setSuccess(true);
      toast.success("Donor registration submitted for review!");
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="text-center py-8" data-ocid="register.success_state">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold mb-2">
          Submitted for Review
        </h3>
        <p className="text-muted-foreground">
          Your donor registration has been submitted and is awaiting admin
          approval.
        </p>
        <Button
          className="mt-6 bg-primary text-primary-foreground"
          onClick={() => {
            setSuccess(false);
            setName("");
            setBloodGroup("");
            setArea("");
            setContactInfo("");
          }}
          data-ocid="register.secondary_button"
        >
          Register Another Donor
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="register.modal"
    >
      <div className="space-y-1.5">
        <Label htmlFor="donor-name">Full Name</Label>
        <Input
          id="donor-name"
          required
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="donor-blood">Blood Group</Label>
        <Select
          required
          value={bloodGroup}
          onValueChange={(v) => setBloodGroup(v as BloodGroup)}
        >
          <SelectTrigger id="donor-blood" data-ocid="register.select">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUP_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="donor-area">Area / City</Label>
        <Input
          id="donor-area"
          required
          placeholder="Your city or area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="donor-contact">Contact Info</Label>
        <Input
          id="donor-contact"
          required
          placeholder="Phone number or email"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <Alert className="border-primary/20 bg-primary/5">
        <Droplets className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs text-muted-foreground">
          Your contact info will only be shared with verified blood recipients.
        </AlertDescription>
      </Alert>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={mutation.isPending || !actorReady}
        data-ocid="register.submit_button"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering…
          </>
        ) : !actorReady ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting…
          </>
        ) : (
          "Register as Donor"
        )}
      </Button>
    </form>
  );
}

function RecipientForm() {
  const [patientName, setPatientName] = useState("");
  const [requiredBloodGroup, setRequiredBloodGroup] = useState<BloodGroup | "">(
    "",
  );
  const [hospitalName, setHospitalName] = useState("");
  const [area, setArea] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | "">(
    UrgencyLevel.Medium,
  );
  const [success, setSuccess] = useState(false);
  const mutation = useRegisterRecipient();
  const actorReady = useIsActorReady();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredBloodGroup || !urgencyLevel) return;
    try {
      await mutation.mutateAsync({
        patientName,
        requiredBloodGroup,
        hospitalName,
        area,
        urgencyLevel,
      });
      setSuccess(true);
      toast.success("Blood request submitted for review!");
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="text-center py-8" data-ocid="register.success_state">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold mb-2">
          Request Under Review
        </h3>
        <p className="text-muted-foreground">
          Your blood request has been submitted and is awaiting admin approval.
        </p>
        <Button
          className="mt-6 bg-primary text-primary-foreground"
          onClick={() => {
            setSuccess(false);
            setPatientName("");
            setRequiredBloodGroup("");
            setHospitalName("");
            setArea("");
            setUrgencyLevel(UrgencyLevel.Medium);
          }}
          data-ocid="register.secondary_button"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="register.modal"
    >
      <div className="space-y-1.5">
        <Label htmlFor="patient-name">Patient Name</Label>
        <Input
          id="patient-name"
          required
          placeholder="Patient's full name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="required-blood">Required Blood Group</Label>
        <Select
          required
          value={requiredBloodGroup}
          onValueChange={(v) => setRequiredBloodGroup(v as BloodGroup)}
        >
          <SelectTrigger id="required-blood" data-ocid="register.select">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUP_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="hospital-name">Hospital Name</Label>
        <Input
          id="hospital-name"
          required
          placeholder="Hospital or clinic name"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="recipient-area">Area / City</Label>
        <Input
          id="recipient-area"
          required
          placeholder="Hospital's city or area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          data-ocid="register.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select
          required
          value={urgencyLevel}
          onValueChange={(v) => setUrgencyLevel(v as UrgencyLevel)}
        >
          <SelectTrigger id="urgency" data-ocid="register.select">
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            {URGENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={mutation.isPending || !actorReady}
        data-ocid="register.submit_button"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
          </>
        ) : !actorReady ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting…
          </>
        ) : (
          "Submit Blood Request"
        )}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <UserPlus className="h-4 w-4" /> Register
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Join Blood Link
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Register as a donor or submit a blood request. Together we save
            lives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <Tabs defaultValue="donor" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2 mb-6"
              data-ocid="register.tab"
            >
              <TabsTrigger value="donor" data-ocid="register.tab">
                <Droplets className="h-4 w-4 mr-2" /> I Want to Donate
              </TabsTrigger>
              <TabsTrigger value="recipient" data-ocid="register.tab">
                <HeartPulse className="h-4 w-4 mr-2" /> I Need Blood
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donor">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    Donor Registration
                  </CardTitle>
                  <CardDescription>
                    Sign up to donate blood and save lives in your area.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonorForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipient">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Blood Request</CardTitle>
                  <CardDescription>
                    Submit a request and reach donors in your area immediately.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecipientForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
