"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  BookOpen,
  Video,
  FileText,
  Clock,
  CheckCircle,
  ExternalLink,
  Send,
  Star,
  ChevronRight,
  Download,
  Shield,
  CreditCard,
  PiggyBank,
  Target,
  Settings,
  User,
  Zap,
  Globe,
  Headphones,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <User className="w-5 h-5" />,
    questions: [
      {
        id: "1",
        question: "How do I create my WAIS account?",
        answer:
          "To create your WAIS account, click 'Sign Up' on our homepage. You can sign up using your email address or through Google/Facebook. After verification, you'll be guided through our onboarding process to set up your financial profile and connect your accounts.",
        tags: ["account", "signup", "onboarding"],
      },
      {
        id: "2",
        question: "How do I connect my bank accounts and credit cards?",
        answer:
          "Go to Settings > Connected Accounts and click 'Add Account'. WAIS uses bank-level encryption and read-only access to securely connect to your financial institutions. We support all major Philippine banks including BPI, BDO, Metrobank, and many others.",
        tags: ["accounts", "security", "banks"],
      },
      {
        id: "3",
        question: "Is WAIS free to use?",
        answer:
          "WAIS offers a free tier with core budgeting and expense tracking features. Our Premium plan (₱299/month) includes advanced features like AI insights, investment tracking, credit monitoring, and priority support.",
        tags: ["pricing", "features", "premium"],
      },
    ],
  },
  {
    id: "budgeting",
    title: "Budgeting & Expenses",
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: "4",
        question: "How does WAIS categorize my expenses automatically?",
        answer:
          "WAIS uses advanced AI to analyze transaction descriptions, merchant names, and spending patterns to automatically categorize your expenses. You can review and adjust categories, and the AI learns from your preferences to improve accuracy over time.",
        tags: ["budgeting", "ai", "categories"],
      },
      {
        id: "5",
        question: "Can I set up budget alerts?",
        answer:
          "Yes! You can set custom budget limits for each category and receive alerts when you're approaching (80%) or exceeding your budget. Alerts are sent via push notification, email, or in-app notifications based on your preferences.",
        tags: ["budgeting", "alerts", "notifications"],
      },
      {
        id: "6",
        question: "How do I track recurring expenses?",
        answer:
          "WAIS automatically detects recurring transactions like subscriptions, bills, and loan payments. You can also manually add recurring expenses with custom frequencies (daily, weekly, monthly, yearly) in the Budget section.",
        tags: ["budgeting", "recurring", "subscriptions"],
      },
    ],
  },
  {
    id: "savings-goals",
    title: "Savings & Goals",
    icon: <PiggyBank className="w-5 h-5" />,
    questions: [
      {
        id: "7",
        question: "How do I set up a savings goal?",
        answer:
          "Go to the Goals section and click 'New Goal'. Enter your target amount, deadline, and choose a category (emergency fund, vacation, house, etc.). You can enable auto-save to automatically transfer money from your checking account to your savings goal.",
        tags: ["goals", "savings", "auto-save"],
      },
      {
        id: "8",
        question: "What happens when I reach my savings goal?",
        answer:
          "When you reach your goal, you'll receive a congratulatory notification and unlock achievement badges. You can then mark the goal as completed, extend it with a higher target, or create a new goal with the saved amount as a starting point.",
        tags: ["goals", "achievements", "completion"],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: <Shield className="w-5 h-5" />,
    questions: [
      {
        id: "9",
        question: "How secure is my financial data with WAIS?",
        answer:
          "WAIS uses bank-level 256-bit SSL encryption, two-factor authentication, and read-only access to your accounts. We're SOC 2 compliant and never store your banking credentials. Your data is encrypted both in transit and at rest, and we undergo regular security audits.",
        tags: ["security", "encryption", "privacy"],
      },
      {
        id: "10",
        question: "Can WAIS access my money or make transactions?",
        answer:
          "No. WAIS only has read-only access to view your account balances and transactions for categorization and analysis. We cannot move money, make payments, or access your funds in any way. All transactions must be initiated by you through your bank's official channels.",
        tags: ["security", "read-only", "transactions"],
      },
    ],
  },
  {
    id: "ai-features",
    title: "AI Features",
    icon: <Zap className="w-5 h-5" />,
    questions: [
      {
        id: "11",
        question: "How does the AI Assistant work?",
        answer:
          "The AI Assistant analyzes your financial patterns, spending habits, and goals to provide personalized recommendations. It can help with budget optimization, savings strategies, debt payoff plans, and answer questions about your finances using natural language processing.",
        tags: ["ai", "assistant", "recommendations"],
      },
      {
        id: "12",
        question: "Can I trust the AI's financial advice?",
        answer:
          "Our AI provides general guidance based on established financial principles and your personal data. However, it's not a substitute for professional financial advice. For complex situations like investments, taxes, or major financial decisions, we recommend consulting with a qualified financial advisor.",
        tags: ["ai", "advice", "disclaimer"],
      },
    ],
  },
];

const supportArticles = [
  {
    id: "1",
    title: "Complete Guide to Setting Up Your First Budget",
    description:
      "Step-by-step tutorial for creating and managing budgets in WAIS",
    category: "Budgeting",
    readTime: "8 min read",
    popular: true,
  },
  {
    id: "2",
    title: "Maximizing Your Savings with Auto-Save Features",
    description: "Learn how to automate your savings and reach goals faster",
    category: "Savings",
    readTime: "5 min read",
    popular: true,
  },
  {
    id: "3",
    title: "Understanding Your Credit Score and How to Improve It",
    description: "Everything you need to know about credit monitoring in WAIS",
    category: "Credit",
    readTime: "12 min read",
    popular: false,
  },
  {
    id: "4",
    title: "Security Best Practices for Your Financial Data",
    description: "Keep your financial information safe with these tips",
    category: "Security",
    readTime: "6 min read",
    popular: true,
  },
  {
    id: "5",
    title: "Advanced AI Insights: Getting the Most from Your Assistant",
    description: "Unlock the full potential of WAIS AI features",
    category: "AI Features",
    readTime: "10 min read",
    popular: false,
  },
];

const videoTutorials = [
  {
    id: "1",
    title: "WAIS Quick Start Guide",
    description: "Get up and running with WAIS in under 10 minutes",
    duration: "8:45",
    thumbnail: "/placeholder-video-thumb.jpg",
  },
  {
    id: "2",
    title: "Creating Your First Budget",
    description: "Learn the basics of budget creation and management",
    duration: "12:30",
    thumbnail: "/placeholder-video-thumb.jpg",
  },
  {
    id: "3",
    title: "Setting Up Savings Goals",
    description: "Master the art of goal setting and achievement tracking",
    duration: "15:20",
    thumbnail: "/placeholder-video-thumb.jpg",
  },
];

const contactMethods = [
  {
    id: "chat",
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
    availability: "Mon-Fri, 9 AM - 6 PM PHT",
    responseTime: "Usually within 5 minutes",
    action: "Start Chat",
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message and we'll get back to you",
    icon: <Mail className="w-6 h-6 text-green-500" />,
    availability: "24/7",
    responseTime: "Within 24 hours",
    action: "Send Email",
  },
  {
    id: "phone",
    title: "Phone Support",
    description: "Call us for urgent issues (Premium users only)",
    icon: <Phone className="w-6 h-6 text-purple-500" />,
    availability: "Mon-Fri, 9 AM - 6 PM PHT",
    responseTime: "Immediate",
    action: "Call Now",
  },
  {
    id: "appointment",
    title: "Schedule a Call",
    description: "Book a one-on-one session with our financial experts",
    icon: <Calendar className="w-6 h-6 text-orange-500" />,
    availability: "By appointment",
    responseTime: "Same day or next business day",
    action: "Book Call",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    priority: "medium",
  });

  const filteredFAQ = faqData.filter(
    (category) => selectedCategory === "all" || category.id === selectedCategory
  );

  const searchResults = searchQuery
    ? faqData.flatMap((category) =>
        category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      )
    : [];

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted:", contactForm);
    setContactFormOpen(false);
    setContactForm({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
      priority: "medium",
    });
  };

  const FAQSearch = () => (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search for help articles, FAQs, or topics..."
        className="pl-10 pr-4 h-12"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-md mt-1 max-h-64 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => setSearchQuery("")}
              >
                <h4 className="font-medium text-sm">{result.question}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {result.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ContactMethodCard = ({ method }: { method: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">{method.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {method.description}
            </p>
            <div className="space-y-1 text-xs text-muted-foreground mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{method.availability}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3 h-3" />
                <span>{method.responseTime}</span>
              </div>
            </div>
            <Button className="w-full">{method.action}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="Help & Support">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you today?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get the support you need to make the most of WAIS
          </p>
          <FAQSearch />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {supportArticles.length}
              </div>
              <p className="text-xs text-muted-foreground">Help articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Video Tutorials
              </CardTitle>
              <Video className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {videoTutorials.length}
              </div>
              <p className="text-xs text-muted-foreground">Video guides</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FAQ Topics</CardTitle>
              <HelpCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {faqData.length}
              </div>
              <p className="text-xs text-muted-foreground">FAQ categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Support Channels
              </CardTitle>
              <Headphones className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {contactMethods.length}
              </div>
              <p className="text-xs text-muted-foreground">Ways to reach us</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="articles">
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {faqData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-8">
              {filteredFAQ.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.questions.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                {faq.answer}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {faq.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {supportArticles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.popular && (
                        <Badge
                          variant="default"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </span>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTutorials.map((video) => (
                <Card
                  key={video.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                        <Video className="w-12 h-12 text-blue-500" />
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/75 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Our support team
                is here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method) => (
                <ContactMethodCard key={method.id} method={method} />
              ))}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) =>
                          setContactForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">
                            Technical Issue
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing & Payments
                          </SelectItem>
                          <SelectItem value="feature">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="security">
                            Security Concern
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={contactForm.priority}
                        onValueChange={(value) =>
                          setContactForm((prev) => ({
                            ...prev,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
