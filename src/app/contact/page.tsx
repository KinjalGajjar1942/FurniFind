"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    interest: "new-furniture",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleInterestChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitMessage("Thank you for your message! We will get back to you soon.");
        setFormData({
          name: "",
          address: "",
          phone: "",
          interest: "new-furniture",
          email: "",
          message: ""
        });
      } else {
        const data = await res.json();
        setSubmitMessage(data.error || "Something went wrong. Please try again later.");
      }
    } catch (err) {
      setSubmitMessage("Something went wrong. Please try again later.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center py-8  bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Contact Us</h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            We'd love to hear from you. Please fill out the form below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Anytown, USA" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>

            <div className="space-y-1">
              <Label>Interest</Label>
              <RadioGroup
                value={formData.interest}
                onValueChange={handleInterestChange}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="new-furniture" id="new-furniture" />
                  <Label htmlFor="new-furniture">New Furniture</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="existing-furniture" id="existing-furniture" />
                  <Label htmlFor="existing-furniture">Existing Furniture</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="Your message..."/>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            {submitMessage && <p className="text-center text-green-500 text-sm">{submitMessage}</p>}
          </form>
        <div className="text-center mt-2">
          <Link href="/" passHref>
            <Button variant="link" className="text-xs p-0 h-6 min-h-0">Back to Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}