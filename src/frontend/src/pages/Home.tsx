import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Droplets,
  Heart,
  Hospital,
  MapPin,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetAllRecipientRequests } from "../hooks/useQueries";
import {
  BLOOD_GROUP_DISPLAY,
  URGENCY_COLOR,
  URGENCY_DISPLAY,
} from "../lib/bloodGroup";

const STATS = [
  { label: "Registered Donors", value: "12,400+", icon: Users },
  { label: "Lives Saved", value: "8,200+", icon: Heart },
  { label: "Cities Covered", value: "340+", icon: MapPin },
  { label: "Partner Hospitals", value: "180+", icon: Hospital },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Search",
    desc: "Select your required blood group and enter your city or area to find available donors and hospitals near you.",
  },
  {
    step: "02",
    icon: UserPlus,
    title: "Register",
    desc: "Sign up as a donor to save lives, or register your blood request so nearby donors can respond quickly.",
  },
  {
    step: "03",
    icon: Heart,
    title: "Connect",
    desc: "Get matched with willing donors or recipients in your area and coordinate a safe donation in minutes.",
  },
];

export default function HomePage() {
  const { data: requests, isLoading } = useGetAllRecipientRequests();
  const urgentRequests =
    requests
      ?.filter(
        (r) => r.urgencyLevel === "Critical" || r.urgencyLevel === "High",
      )
      .slice(0, 4) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5" />
          <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-primary/5" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-0 font-medium">
              🩸 Save Lives Today
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
              Connecting Lives
              <br />
              <span className="text-primary">Through Blood</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Blood Link bridges the gap between donors and recipients in
              real-time. Find the blood you need or become a hero by donating
              today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                data-ocid="home.primary_button"
              >
                <Link to="/find-blood">Find Blood Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-accent"
                data-ocid="home.secondary_button"
              >
                <Link to="/register">Become a Donor</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden md:block"
          >
            <img
              src="/assets/generated/blood-donation-hero.dim_600x500.png"
              alt="Blood donation - connecting donors with recipients"
              className="rounded-2xl shadow-card w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-7 w-7 mx-auto mb-2 text-white/80" />
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/75 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Three simple steps to connect donors with those in need.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="border border-border hover:border-primary/30 hover:shadow-card transition-all group">
                  <CardContent className="pt-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary/50 mb-1">
                      STEP {item.step}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Requests */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Urgent Requests
              </h2>
              <p className="text-muted-foreground mt-1">
                Patients who need blood urgently right now
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-accent hidden md:flex"
              data-ocid="home.secondary_button"
            >
              <Link to="/find-blood">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              data-ocid="home.loading_state"
            >
              {[1, 2, 3, 4].map((n) => (
                <Card key={n} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-4 bg-muted rounded mb-3 w-3/4" />
                    <div className="h-3 bg-muted rounded mb-2 w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : urgentRequests.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="home.empty_state"
            >
              <Droplets className="h-12 w-12 mx-auto mb-3 text-primary/30" />
              <p>No urgent requests at this time.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {urgentRequests.map((req, i) => (
                <motion.div
                  key={req.requestId.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`home.item.${i + 1}`}
                >
                  <Card className="border-l-4 border-l-primary hover:shadow-card transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                          {BLOOD_GROUP_DISPLAY[req.requiredBloodGroup]}
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${URGENCY_COLOR[req.urgencyLevel]}`}
                        >
                          {URGENCY_DISPLAY[req.urgencyLevel]}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">
                        {req.patientName}
                      </h4>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Hospital className="h-3 w-3" /> {req.hospitalName}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {req.area}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Fallback sample cards when backend empty */}
          {!isLoading && urgentRequests.length === 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[
                {
                  name: "Arjun Sharma",
                  blood: "O-",
                  hospital: "City General Hospital",
                  area: "Mumbai",
                  urgency: "Critical",
                },
                {
                  name: "Priya Mehta",
                  blood: "AB+",
                  hospital: "Apollo Medical Center",
                  area: "Delhi",
                  urgency: "High",
                },
                {
                  name: "Rohan Verma",
                  blood: "B+",
                  hospital: "Fortis Healthcare",
                  area: "Bangalore",
                  urgency: "Critical",
                },
                {
                  name: "Sunita Patel",
                  blood: "A-",
                  hospital: "Lilavati Hospital",
                  area: "Pune",
                  urgency: "High",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`home.item.${i + 1}`}
                >
                  <Card className="border-l-4 border-l-primary hover:shadow-card transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                          {item.blood}
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.urgency === "Critical"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">
                        {item.name}
                      </h4>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Hospital className="h-3 w-3" /> {item.hospital}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {item.area}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Droplets className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Save a Life?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              One donation can save up to three lives. Register as a donor today
              and be someone's hero.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="home.primary_button"
              >
                <Link to="/register">Register Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary"
                data-ocid="home.secondary_button"
              >
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
