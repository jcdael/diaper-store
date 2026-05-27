'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Truck, Lock, ShoppingBag, ArrowLeft,
  CheckCircle, AlertCircle, MapPin, Phone, Mail, User,
  Tag, ChevronDown, ChevronUp, Shield, RefreshCw,
  FileText, Clock, Package, Gift, Check, Minus, Plus, Trash2
} from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FormData {
  // Contact
  email: string;
  phone: string;
  // Shipping
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Billing
  sameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingCompany: string;
  billingAddress: string;
  billingApartment: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  // Payment
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  // Extras
  orderNotes: string;
  promoCode: string;
  saveInfo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia',
  'Germany', 'France', 'Japan', 'India', 'Brazil', 'Mexico',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway',
  'New Zealand', 'Singapore', 'South Korea', 'Ireland', 'Belgium',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const PROMO_CODES: Record<string, { discount: number; type: 'percent' | 'fixed'; label: string }> = {
  'BABY10': { discount: 10, type: 'percent', label: '10% off' },
  'WELCOME5': { discount: 5, type: 'fixed', label: '$5 off' },
  'BUNDLE15': { discount: 15, type: 'percent', label: '15% off' },
};

const STEPS = [
  { id: 1, label: 'Contact', icon: Mail },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Review', icon: FileText },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatCardNumber(value: string): string {
  const cleaned = (value ?? '').replace(/\D/g, '').slice(0, 16);
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const cleaned = (value ?? '').replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return cleaned;
}

function detectCardType(number: string): string {
  const cleaned = (number ?? '').replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  return 'generic';
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */
function StepIndicator({ currentStep, onStepClick }: { currentStep: number; onStepClick: (s: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => { if (isComplete) onStepClick(step.id); }}
              className={`flex items-center gap-2 transition-all ${
                isComplete ? 'cursor-pointer' : isActive ? 'cursor-default' : 'cursor-default'
              }`}
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all ${
                isComplete
                  ? 'bg-primary text-primary-foreground'
                  : isActive
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isComplete ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                isActive ? 'text-foreground' : isComplete ? 'text-primary' : 'text-muted-foreground'
              }`}>{step.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] mx-3 rounded-full transition-all ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SecurityBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-5 border-t border-border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        <span>256-bit SSL</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        <span>PCI Compliant</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>30-Day Returns</span>
      </div>
    </div>
  );
}

function CardTypeIndicator({ cardNumber }: { cardNumber: string }) {
  const type = detectCardType(cardNumber);
  const labels: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'Amex',
    discover: 'Discover',
    generic: '',
  };
  const colors: Record<string, string> = {
    visa: 'bg-blue-100 text-blue-700',
    mastercard: 'bg-orange-100 text-orange-700',
    amex: 'bg-indigo-100 text-indigo-700',
    discover: 'bg-amber-100 text-amber-700',
    generic: '',
  };
  if (type === 'generic' || !cardNumber) return null;
  return (
    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${colors[type]}`}>
      {labels[type]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function CheckoutClient() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart, updateItemQuantity, removeItem } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showOrderSummaryMobile, setShowOrderSummaryMobile] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const discountAmount = promoApplied ? promoApplied.discount : 0;
  const shipping = subtotal >= 49 ? 0 : 5.99;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const tax = parseFloat((afterDiscount * 0.08).toFixed(2));
  const total = afterDiscount + shipping + tax;

  const [form, setForm] = useState<FormData>({
    email: '', phone: '',
    firstName: '', lastName: '', company: '',
    address: '', apartment: '', city: '', state: '', zipCode: '', country: 'United States',
    sameAsShipping: true,
    billingFirstName: '', billingLastName: '', billingCompany: '',
    billingAddress: '', billingApartment: '', billingCity: '',
    billingState: '', billingZipCode: '', billingCountry: 'United States',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
    orderNotes: '', promoCode: '', saveInfo: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  // Load saved info from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lb_checkout_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev: FormData) => ({
          ...prev,
          email: parsed.email ?? '',
          phone: parsed.phone ?? '',
          firstName: parsed.firstName ?? '',
          lastName: parsed.lastName ?? '',
          address: parsed.address ?? '',
          apartment: parsed.apartment ?? '',
          city: parsed.city ?? '',
          state: parsed.state ?? '',
          zipCode: parsed.zipCode ?? '',
          country: parsed.country ?? 'United States',
        }));
      }
    } catch {}
  }, []);

  /* ---- Empty / Complete States ---- */
  if ((items?.length ?? 0) === 0 && !orderComplete) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Add some products before checking out.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium mt-6 hover:opacity-90 transition-opacity">
          <ShoppingBag className="h-4 w-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-3 text-lg">Thank you for your purchase.</p>
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] mt-8 text-left">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Order Number</p>
                <p className="font-mono text-lg font-bold text-primary">{orderComplete}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="text-sm font-medium">3–7 Business Days</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-lg p-3">
                <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-[11px] text-muted-foreground">Order Placed</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Processing</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <CheckCircle className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Delivered</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-5">A confirmation email has been sent to your email address with tracking details.</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium mt-8 hover:opacity-90 transition-opacity">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ---- Handlers ---- */
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    let formatted = value;
    if (typeof value === 'string') {
      if (field === 'cardNumber') formatted = formatCardNumber(value);
      if (field === 'cardExpiry') formatted = formatExpiry(value);
      if (field === 'cardCvv') formatted = (value ?? '').replace(/\D/g, '').slice(0, 4);
      if (field === 'phone') formatted = (value ?? '').replace(/[^\d+\-() ]/g, '').slice(0, 20);
    }
    setForm((prev: FormData) => ({ ...(prev ?? {}), [field]: formatted }));
    if (errors?.[field]) {
      setErrors((prev: FormErrors) => {
        const next = { ...(prev ?? {}) };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: FormErrors = {};

    if (step >= 1) {
      if (!(form?.email ?? '').trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form?.email ?? '')) errs.email = 'Enter a valid email';
      if (!(form?.phone ?? '').trim()) errs.phone = 'Phone number is required';
    }
    if (step >= 2) {
      if (!(form?.firstName ?? '').trim()) errs.firstName = 'First name is required';
      if (!(form?.lastName ?? '').trim()) errs.lastName = 'Last name is required';
      if (!(form?.address ?? '').trim()) errs.address = 'Address is required';
      if (!(form?.city ?? '').trim()) errs.city = 'City is required';
      if (!(form?.state ?? '').trim()) errs.state = 'State is required';
      if (!(form?.zipCode ?? '').trim()) errs.zipCode = 'ZIP code is required';

      if (!form.sameAsShipping) {
        if (!(form?.billingFirstName ?? '').trim()) errs.billingFirstName = 'First name is required';
        if (!(form?.billingLastName ?? '').trim()) errs.billingLastName = 'Last name is required';
        if (!(form?.billingAddress ?? '').trim()) errs.billingAddress = 'Address is required';
        if (!(form?.billingCity ?? '').trim()) errs.billingCity = 'City is required';
        if (!(form?.billingState ?? '').trim()) errs.billingState = 'State is required';
        if (!(form?.billingZipCode ?? '').trim()) errs.billingZipCode = 'ZIP code is required';
      }
    }
    if (step >= 3) {
      if (!(form?.cardName ?? '').trim()) errs.cardName = 'Cardholder name is required';
      if ((form?.cardNumber ?? '').replace(/\s/g, '').length < 15) errs.cardNumber = 'Enter a valid card number';
      const expiryDigits = (form?.cardExpiry ?? '').replace(/\//g, '');
      if (expiryDigits.length < 4) errs.cardExpiry = 'Enter a valid expiry';
      else {
        const month = parseInt(expiryDigits.slice(0, 2));
        if (month < 1 || month > 12) errs.cardExpiry = 'Invalid month';
      }
      if ((form?.cardCvv ?? '').length < 3) errs.cardCvv = 'Enter a valid CVV';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep = (step: number) => {
    if (step > currentStep) {
      if (!validateStep(currentStep)) {
        toast.error('Please fix the errors before continuing');
        return;
      }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError('');
    if (!code) { setPromoError('Enter a promo code'); return; }
    const promo = PROMO_CODES[code];
    if (!promo) { setPromoError('Invalid promo code'); return; }
    const discountAmt = promo.type === 'percent' ? parseFloat((subtotal * promo.discount / 100).toFixed(2)) : promo.discount;
    setPromoApplied({ code, discount: discountAmt, label: promo.label });
    toast.success(`Promo code applied: ${promo.label}`);
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validateStep(3)) {
      toast.error('Please complete all required fields');
      return;
    }

    // Save info if opted in
    if (form.saveInfo) {
      try {
        localStorage.setItem('lb_checkout_info', JSON.stringify({
          email: form.email, phone: form.phone,
          firstName: form.firstName, lastName: form.lastName,
          address: form.address, apartment: form.apartment,
          city: form.city, state: form.state, zipCode: form.zipCode, country: form.country,
        }));
      } catch {}
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone,
          address: form.address, apartment: form.apartment,
          city: form.city, state: form.state, zipCode: form.zipCode, country: form.country,
          sameAsShipping: form.sameAsShipping,
          sameAsBilling: form.sameAsShipping,
          billingFirstName: form.sameAsShipping ? form.firstName : form.billingFirstName,
          billingLastName: form.sameAsShipping ? form.lastName : form.billingLastName,
          billingAddress: form.sameAsShipping ? form.address : form.billingAddress,
          billingApartment: form.sameAsShipping ? form.apartment : form.billingApartment,
          billingCity: form.sameAsShipping ? form.city : form.billingCity,
          billingState: form.sameAsShipping ? form.state : form.billingState,
          billingZipCode: form.sameAsShipping ? form.zipCode : form.billingZipCode,
          billingCountry: form.sameAsShipping ? form.country : form.billingCountry,
          orderNotes: form.orderNotes,
          cardName: form.cardName,
          cardNumber: form.cardNumber,
          cardExpiry: form.cardExpiry,
          cardCvv: form.cardCvv,
          promoCode: promoApplied?.code ?? '',
          items: (items ?? []).map((i: any) => ({
            productId: i?.productId ?? '',
            quantity: i?.quantity ?? 1,
            price: i?.price ?? 0,
            name: i?.name ?? '',
          })),
          subtotal,
          discount: discountAmount,
          shipping,
          tax,
          total,
        }),
      });
      const data = await res?.json?.();
      const orderNumber = data?.orderNumber ?? data?.orderId;
      if (orderNumber) {
        clearCart();
        setOrderComplete(orderNumber);
        toast.success('Order placed successfully!');
      } else {
        toast.error(data?.error ?? 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Input Helpers ---- */
  const inputClass = (field: string) =>
    `w-full bg-background border ${
      errors?.[field] ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'
    } rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/60`;

  const selectClass = (field: string) =>
    `w-full bg-background border ${
      errors?.[field] ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'
    } rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none`;

  const errorMsg = (field: string) =>
    errors?.[field] ? (
      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />{errors[field]}
      </p>
    ) : null;

  /* ---- Step Renderers ---- */
  const renderContactStep = () => (
    <motion.div
      key="contact"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Contact Information</h2>
            <p className="text-xs text-muted-foreground">We&apos;ll use this to send your order confirmation</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={form.email} onChange={(e: any) => handleChange('email', e?.target?.value ?? '')} className={`${inputClass('email')} pl-10`} placeholder="your@email.com" />
            </div>
            {errorMsg('email')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="tel" value={form.phone} onChange={(e: any) => handleChange('phone', e?.target?.value ?? '')} className={`${inputClass('phone')} pl-10`} placeholder="(555) 123-4567" />
            </div>
            {errorMsg('phone')}
            <p className="text-[11px] text-muted-foreground mt-1">For delivery updates and order notifications</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.saveInfo}
              onChange={(e: any) => handleChange('saveInfo', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">Save my information for faster checkout next time</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => goToStep(2)} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          Continue to Shipping <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </motion.div>
  );

  const renderShippingStep = () => (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Shipping Address */}
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Shipping Address</h2>
            <p className="text-xs text-muted-foreground">Where should we deliver your order?</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={form.firstName} onChange={(e: any) => handleChange('firstName', e?.target?.value ?? '')} className={`${inputClass('firstName')} pl-10`} placeholder="John" />
            </div>
            {errorMsg('firstName')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Last Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={form.lastName} onChange={(e: any) => handleChange('lastName', e?.target?.value ?? '')} className={`${inputClass('lastName')} pl-10`} placeholder="Smith" />
            </div>
            {errorMsg('lastName')}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Company <span className="text-muted-foreground/60 normal-case">(optional)</span></label>
            <input type="text" value={form.company} onChange={(e: any) => handleChange('company', e?.target?.value ?? '')} className={inputClass('company')} placeholder="Company name" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Street Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={form.address} onChange={(e: any) => handleChange('address', e?.target?.value ?? '')} className={`${inputClass('address')} pl-10`} placeholder="123 Main Street" />
            </div>
            {errorMsg('address')}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Apartment, Suite, etc. <span className="text-muted-foreground/60 normal-case">(optional)</span></label>
            <input type="text" value={form.apartment} onChange={(e: any) => handleChange('apartment', e?.target?.value ?? '')} className={inputClass('apartment')} placeholder="Apt 4B, Suite 200, etc." />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">City *</label>
            <input type="text" value={form.city} onChange={(e: any) => handleChange('city', e?.target?.value ?? '')} className={inputClass('city')} placeholder="New York" />
            {errorMsg('city')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">State / Province *</label>
            {form.country === 'United States' ? (
              <select value={form.state} onChange={(e: any) => handleChange('state', e?.target?.value ?? '')} className={selectClass('state')}>
                <option value="">Select state</option>
                {US_STATES.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input type="text" value={form.state} onChange={(e: any) => handleChange('state', e?.target?.value ?? '')} className={inputClass('state')} placeholder="State or Province" />
            )}
            {errorMsg('state')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">ZIP / Postal Code *</label>
            <input type="text" value={form.zipCode} onChange={(e: any) => handleChange('zipCode', e?.target?.value ?? '')} className={inputClass('zipCode')} placeholder="10001" />
            {errorMsg('zipCode')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Country *</label>
            <select value={form.country} onChange={(e: any) => handleChange('country', e?.target?.value ?? '')} className={selectClass('country')}>
              {COUNTRIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="mt-6 pt-5 border-t border-border">
          <h3 className="text-sm font-bold mb-3">Shipping Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 bg-primary/5 border-2 border-primary rounded-lg p-3.5 cursor-pointer">
              <input type="radio" name="shipping" checked readOnly className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Standard Shipping</p>
                <p className="text-xs text-muted-foreground">5–7 business days</p>
              </div>
              <span className="text-sm font-bold">{subtotal >= 49 ? <span className="text-primary">FREE</span> : '$5.99'}</span>
            </label>
            <label className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg p-3.5 cursor-pointer opacity-60">
              <input type="radio" name="shipping" disabled className="w-4 h-4" />
              <div className="flex-1">
                <p className="text-sm font-medium">Express Shipping</p>
                <p className="text-xs text-muted-foreground">2–3 business days</p>
              </div>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </label>
          </div>
          {subtotal < 49 && (
            <p className="text-xs text-primary mt-2 flex items-center gap-1">
              <Gift className="h-3.5 w-3.5" /> Add ${(49 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}
        </div>
      </div>

      {/* Billing Address Toggle */}
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-display text-lg font-bold">Billing Address</h2>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.sameAsShipping}
            onChange={(e: any) => handleChange('sameAsShipping', e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm">Same as shipping address</span>
        </label>

        <AnimatePresence mode="wait">
          {!form.sameAsShipping && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">First Name *</label>
                  <input type="text" value={form.billingFirstName} onChange={(e: any) => handleChange('billingFirstName', e?.target?.value ?? '')} className={inputClass('billingFirstName')} placeholder="John" />
                  {errorMsg('billingFirstName')}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Last Name *</label>
                  <input type="text" value={form.billingLastName} onChange={(e: any) => handleChange('billingLastName', e?.target?.value ?? '')} className={inputClass('billingLastName')} placeholder="Smith" />
                  {errorMsg('billingLastName')}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Company <span className="text-muted-foreground/60 normal-case">(optional)</span></label>
                  <input type="text" value={form.billingCompany} onChange={(e: any) => handleChange('billingCompany', e?.target?.value ?? '')} className={inputClass('billingCompany')} placeholder="Company name" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={form.billingAddress} onChange={(e: any) => handleChange('billingAddress', e?.target?.value ?? '')} className={`${inputClass('billingAddress')} pl-10`} placeholder="123 Main Street" />
                  </div>
                  {errorMsg('billingAddress')}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Apartment, Suite, etc. <span className="text-muted-foreground/60 normal-case">(optional)</span></label>
                  <input type="text" value={form.billingApartment} onChange={(e: any) => handleChange('billingApartment', e?.target?.value ?? '')} className={inputClass('billingApartment')} placeholder="Apt 4B" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">City *</label>
                  <input type="text" value={form.billingCity} onChange={(e: any) => handleChange('billingCity', e?.target?.value ?? '')} className={inputClass('billingCity')} placeholder="New York" />
                  {errorMsg('billingCity')}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">State / Province *</label>
                  {form.billingCountry === 'United States' ? (
                    <select value={form.billingState} onChange={(e: any) => handleChange('billingState', e?.target?.value ?? '')} className={selectClass('billingState')}>
                      <option value="">Select state</option>
                      {US_STATES.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form.billingState} onChange={(e: any) => handleChange('billingState', e?.target?.value ?? '')} className={inputClass('billingState')} placeholder="State" />
                  )}
                  {errorMsg('billingState')}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">ZIP / Postal Code *</label>
                  <input type="text" value={form.billingZipCode} onChange={(e: any) => handleChange('billingZipCode', e?.target?.value ?? '')} className={inputClass('billingZipCode')} placeholder="10001" />
                  {errorMsg('billingZipCode')}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Country *</label>
                  <select value={form.billingCountry} onChange={(e: any) => handleChange('billingCountry', e?.target?.value ?? '')} className={selectClass('billingCountry')}>
                    {COUNTRIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Notes */}
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <button type="button" onClick={() => setShowNotes(!showNotes)} className="flex items-center gap-2 w-full text-left">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Add order notes</span>
          <span className="text-xs text-muted-foreground">(optional)</span>
          {showNotes ? <ChevronUp className="h-4 w-4 ml-auto text-muted-foreground" /> : <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />}
        </button>
        <AnimatePresence mode="wait">
          {showNotes && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <textarea
                value={form.orderNotes}
                onChange={(e: any) => handleChange('orderNotes', e?.target?.value ?? '')}
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/60"
                placeholder="Special delivery instructions, gift message, or other notes..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between gap-3">
        <button type="button" onClick={() => goToStep(1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={() => goToStep(3)} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          Continue to Payment <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </motion.div>
  );

  const renderPaymentStep = () => (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Payment Details</h2>
            <p className="text-xs text-muted-foreground">All transactions are secure and encrypted</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3" /> SSL Secured
          </div>
        </div>

        {/* Card Type Indicators */}
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground">We accept:</span>
          <div className="flex gap-1.5">
            {['Visa', 'Mastercard', 'Amex', 'Discover'].map((card) => (
              <span key={card} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">{card}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Cardholder Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={form.cardName} onChange={(e: any) => handleChange('cardName', e?.target?.value ?? '')} className={`${inputClass('cardName')} pl-10`} placeholder="Name as it appears on card" />
            </div>
            {errorMsg('cardName')}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Number *</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e: any) => handleChange('cardNumber', e?.target?.value ?? '')}
                className={`${inputClass('cardNumber')} pl-10 pr-20 font-mono tracking-wider`}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
              <CardTypeIndicator cardNumber={form.cardNumber} />
            </div>
            {errorMsg('cardNumber')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry Date *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.cardExpiry}
                  onChange={(e: any) => handleChange('cardExpiry', e?.target?.value ?? '')}
                  className={`${inputClass('cardExpiry')} pl-10 font-mono tracking-wider`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              {errorMsg('cardExpiry')}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">CVV *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={form.cardCvv}
                  onChange={(e: any) => handleChange('cardCvv', e?.target?.value ?? '')}
                  className={`${inputClass('cardCvv')} pl-10 font-mono tracking-wider`}
                  placeholder="•••"
                  maxLength={4}
                />
              </div>
              {errorMsg('cardCvv')}
              <p className="text-[11px] text-muted-foreground mt-1">3 or 4 digits on the back of your card</p>
            </div>
          </div>
        </div>

        <SecurityBadges />
      </div>

      <div className="flex justify-between gap-3">
        <button type="button" onClick={() => goToStep(2)} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={() => goToStep(4)} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          Review Order <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Review Sections */}
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <h2 className="font-display text-lg font-bold mb-5">Review Your Order</h2>

        {/* Contact Summary */}
        <div className="flex items-start justify-between py-3 border-b border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
            <p className="text-sm mt-1">{form.email}</p>
            <p className="text-sm text-muted-foreground">{form.phone}</p>
          </div>
          <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-primary hover:underline">Edit</button>
        </div>

        {/* Ship To Summary */}
        <div className="flex items-start justify-between py-3 border-b border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ship To</p>
            <p className="text-sm mt-1">{form.firstName} {form.lastName}</p>
            <p className="text-sm text-muted-foreground">{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
            <p className="text-sm text-muted-foreground">{form.city}, {form.state} {form.zipCode}</p>
            <p className="text-sm text-muted-foreground">{form.country}</p>
          </div>
          <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-primary hover:underline">Edit</button>
        </div>

        {/* Billing Summary */}
        <div className="flex items-start justify-between py-3 border-b border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bill To</p>
            {form.sameAsShipping ? (
              <p className="text-sm mt-1 text-muted-foreground">Same as shipping address</p>
            ) : (
              <>
                <p className="text-sm mt-1">{form.billingFirstName} {form.billingLastName}</p>
                <p className="text-sm text-muted-foreground">{form.billingAddress}{form.billingApartment ? `, ${form.billingApartment}` : ''}</p>
                <p className="text-sm text-muted-foreground">{form.billingCity}, {form.billingState} {form.billingZipCode}</p>
              </>
            )}
          </div>
          <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-primary hover:underline">Edit</button>
        </div>

        {/* Payment Summary */}
        <div className="flex items-start justify-between py-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</p>
            <p className="text-sm mt-1 font-mono">•••• •••• •••• {(form.cardNumber ?? '').replace(/\s/g, '').slice(-4)}</p>
            <p className="text-sm text-muted-foreground">Expires {form.cardExpiry}</p>
          </div>
          <button type="button" onClick={() => setCurrentStep(3)} className="text-xs text-primary hover:underline">Edit</button>
        </div>

        {form.orderNotes && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Notes</p>
            <p className="text-sm mt-1 text-muted-foreground italic">&quot;{form.orderNotes}&quot;</p>
          </div>
        )}
      </div>

      {/* Cart Items Review */}
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] border border-border/50">
        <h3 className="text-sm font-bold mb-4">Items ({itemCount})</h3>
        <div className="space-y-3">
          {(items ?? []).map((item: any, i: number) => (
            <div key={item?.productId ?? i} className="flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image src={item?.imageUrl ?? ''} alt={item?.name ?? 'Product'} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item?.name ?? ''}</p>
                <p className="text-xs text-muted-foreground">Qty: {item?.quantity ?? 0}</p>
              </div>
              <p className="text-sm font-bold">${((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button type="button" onClick={() => goToStep(3)} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 text-base"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              Processing...
            </span>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Place Order — ${total.toFixed(2)}
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By placing your order, you agree to our terms and conditions. Your payment information is encrypted and secure.
      </p>
    </motion.div>
  );

  /* ---- Main Render ---- */
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Secure Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6">Complete your order in just a few steps</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-3">
            <StepIndicator currentStep={currentStep} onStepClick={(s: number) => setCurrentStep(s)} />
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderContactStep()}
              {currentStep === 2 && renderShippingStep()}
              {currentStep === 3 && renderPaymentStep()}
              {currentStep === 4 && renderReviewStep()}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setShowOrderSummaryMobile(!showOrderSummaryMobile)}
              className="flex items-center justify-between w-full lg:hidden bg-card rounded-xl p-4 shadow-[var(--shadow-md)] border border-border/50 mb-4"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <ShoppingBag className="h-4 w-4" />
                {showOrderSummaryMobile ? 'Hide' : 'Show'} order summary ({itemCount} items)
              </span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </button>

            <div className={`${showOrderSummaryMobile ? 'block' : 'hidden'} lg:block`}>
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Items */}
                <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-md)] border border-border/50">
                  <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    Your Cart ({itemCount})
                  </h3>
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {(items ?? []).map((item: any, i: number) => (
                      <div key={item?.productId ?? i} className="flex gap-3 group">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item?.imageUrl ?? ''} alt={item?.name ?? 'Product'} fill className="object-cover" sizes="56px" />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                            {item?.quantity ?? 0}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-1">{item?.name ?? ''}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button type="button" onClick={() => updateItemQuantity(item.productId, Math.max(1, (item?.quantity ?? 1) - 1))} className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-xs font-mono w-5 text-center">{item?.quantity ?? 0}</span>
                            <button type="button" onClick={() => updateItemQuantity(item.productId, (item?.quantity ?? 0) + 1)} className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                            <button type="button" onClick={() => removeItem(item.productId)} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold self-center">${((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-md)] border border-border/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Promo Code
                  </h3>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                      <div>
                        <span className="text-sm font-mono font-bold text-primary">{promoApplied.code}</span>
                        <span className="text-xs text-muted-foreground ml-2">({promoApplied.label})</span>
                      </div>
                      <button type="button" onClick={removePromo} className="text-xs text-destructive hover:underline">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e: any) => { setPromoInput(e?.target?.value ?? ''); setPromoError(''); }}
                          placeholder="Enter code"
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono uppercase"
                        />
                        <button type="button" onClick={applyPromo} className="bg-foreground text-background px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-xs text-destructive mt-1.5">{promoError}</p>}
                      <p className="text-[11px] text-muted-foreground mt-2">Try: BABY10, WELCOME5, or BUNDLE15</p>
                    </>
                  )}
                </div>

                {/* Totals */}
                <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-md)] border border-border/50">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? <span className="text-primary font-medium">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (est.)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2.5 flex justify-between">
                      <span className="font-bold text-base">Total</span>
                      <span className="font-bold text-xl">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {subtotal < 49 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                        <Gift className="h-3.5 w-3.5 text-primary" />
                        <span>${(49 - subtotal).toFixed(2)} away from free shipping</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${Math.min(100, (subtotal / 49) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Guarantee */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold">Satisfaction Guaranteed</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        30-day hassle-free returns. Not satisfied? Full refund, no questions asked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
