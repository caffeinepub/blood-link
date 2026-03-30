import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertCircle,
  Droplets,
  Hospital,
  MapPin,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type BloodGroup,
  useSearchDonors,
  useSearchRecipients,
} from "../hooks/useQueries";
import {
  BLOOD_GROUP_DISPLAY,
  BLOOD_GROUP_OPTIONS,
  URGENCY_COLOR,
  URGENCY_DISPLAY,
} from "../lib/bloodGroup";

export default function FindBloodPage() {
  const [selectedBloodGroup, setSelectedBloodGroup] =
    useState<BloodGroup | null>(null);
  const [area, setArea] = useState("");
  const [searched, setSearched] = useState(false);

  const donorsQuery = useSearchDonors(selectedBloodGroup, area, searched);
  const recipientsQuery = useSearchRecipients(
    selectedBloodGroup,
    area,
    searched,
  );

  const handleSearch = () => {
    if (!selectedBloodGroup) return;
    setSearched(true);
  };

  const isLoading = donorsQuery.isLoading || recipientsQuery.isLoading;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Droplets className="h-4 w-4" /> Find Blood
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Search Blood Donors
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find available donors and urgent recipient requests in your area.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-2xl mx-auto mb-12 shadow-card">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select
                    value={selectedBloodGroup ?? ""}
                    onValueChange={(v) => {
                      setSelectedBloodGroup(v as BloodGroup);
                      setSearched(false);
                    }}
                  >
                    <SelectTrigger
                      id="blood-group"
                      data-ocid="find_blood.select"
                    >
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
                  <Label htmlFor="area">Area / City</Label>
                  <Input
                    id="area"
                    placeholder="e.g. Mumbai, Delhi…"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      setSearched(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-ocid="find_blood.input"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!selectedBloodGroup}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="find_blood.primary_button"
                >
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {searched && (
          <div className="space-y-10">
            {/* Donors */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">
                Available Donors
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                {selectedBloodGroup &&
                  `${BLOOD_GROUP_DISPLAY[selectedBloodGroup]} donors${area ? ` in ${area}` : ""}`}
              </p>

              {isLoading ? (
                <div
                  className="grid md:grid-cols-3 gap-4"
                  data-ocid="find_blood.loading_state"
                >
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-28 rounded-lg" />
                  ))}
                </div>
              ) : donorsQuery.data?.length === 0 ? (
                <Card
                  className="border-dashed"
                  data-ocid="find_blood.empty_state"
                >
                  <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
                    <Droplets className="h-10 w-10 mx-auto mb-2 text-primary/30" />
                    <p>No donors found matching your criteria.</p>
                    <p className="text-xs mt-1">
                      Try a different blood group or area.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {donorsQuery.data?.map((donor, i) => (
                    <motion.div
                      key={donor.donorId.toString()}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      data-ocid={`find_blood.item.${i + 1}`}
                    >
                      <Card className="hover:shadow-card transition-shadow border-border">
                        <CardContent className="pt-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                              {BLOOD_GROUP_DISPLAY[donor.bloodGroup]}
                            </div>
                            <div>
                              <div className="font-semibold text-sm flex items-center gap-1">
                                <User className="h-3 w-3 text-muted-foreground" />{" "}
                                {donor.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {donor.area}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Donor
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Recipient Requests */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">
                Recipient Requests
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                People who urgently need blood in this area
              </p>
              {recipientsQuery.data?.length === 0 ? (
                <Card
                  className="border-dashed"
                  data-ocid="find_blood.empty_state"
                >
                  <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 text-primary/30" />
                    <p>No active requests found in this area.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {recipientsQuery.data?.map((req, i) => (
                    <motion.div
                      key={req.requestId.toString()}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      data-ocid={`find_blood.item.${i + 1}`}
                    >
                      <Card className="border-l-4 border-l-primary hover:shadow-card transition-shadow">
                        <CardContent className="pt-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                              {BLOOD_GROUP_DISPLAY[req.requiredBloodGroup]}
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${URGENCY_COLOR[req.urgencyLevel]}`}
                            >
                              {URGENCY_DISPLAY[req.urgencyLevel]}
                            </span>
                          </div>
                          <div className="font-semibold text-sm">
                            {req.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Hospital className="h-3 w-3" /> {req.hospitalName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {req.area}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial prompt */}
        {!searched && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-14 w-14 mx-auto mb-4 text-primary/20" />
            <p className="text-lg">Select a blood group to start searching</p>
          </div>
        )}
      </div>
    </div>
  );
}
