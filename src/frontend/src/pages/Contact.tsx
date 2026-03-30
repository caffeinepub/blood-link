import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitContactForm } from "../hooks/useQueries";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "1-800-BLOOD-HELP",
    sub: "24/7 Emergency Hotline",
  },
  {
    icon: Mail,
    label: "Email",
    value: "bloodlink@healthcare.org",
    sub: "Reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "42 Medical Plaza, New Delhi",
    sub: "Mon–Fri, 9am–6pm",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "24/7 Available",
    sub: "For blood emergencies",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ name, email, message });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you shortly.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <MessageSquare className="h-4 w-4" /> Contact Us
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Get In Touch
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Have a question, or need assistance? We're here to help 24/7.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div
                    className="text-center py-8"
                    data-ocid="contact.success_state"
                  >
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">
                      Message Received!
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Thank you for reaching out. Our team will respond within
                      24 hours.
                    </p>
                    <Button
                      className="mt-6 bg-primary text-primary-foreground"
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setEmail("");
                        setMessage("");
                      }}
                      data-ocid="contact.secondary_button"
                    >
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        required
                        placeholder="How can we help you?"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        data-ocid="contact.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={mutation.isPending}
                      data-ocid="contact.submit_button"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            <h2 className="font-display text-2xl font-bold">
              Contact Information
            </h2>
            <p className="text-muted-foreground text-sm">
              Reach out to us through any of the following channels. Our team is
              always ready to assist with blood emergencies.
            </p>
            <div className="space-y-4">
              {CONTACT_DETAILS.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  data-ocid={`contact.item.${i + 1}`}
                >
                  <Card className="hover:border-primary/30 hover:shadow-card transition-all">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <detail.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-0.5">
                            {detail.label}
                          </div>
                          <div className="font-semibold text-sm">
                            {detail.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {detail.sub}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="bg-primary rounded-xl p-5 text-primary-foreground">
              <h3 className="font-display text-lg font-bold mb-2">
                Emergency Blood Request?
              </h3>
              <p className="text-sm text-white/80 mb-3">
                If you need blood urgently, don't wait — use our Find Blood tool
                or call our hotline immediately.
              </p>
              <div className="text-xl font-bold">1-800-BLOOD-HELP</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
