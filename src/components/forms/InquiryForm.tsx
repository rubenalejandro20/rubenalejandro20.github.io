import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';

type InquiryType = 'livestream' | 'analytics' | 'partnership' | 'other';

interface Props {
  accessKey: string;
  defaultType?: InquiryType;
}

const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
  { value: 'livestream', label: 'Livestream Production' },
  { value: 'analytics', label: 'Matchday Analytics' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

const CITY_OPTIONS = ['DFW', 'Houston', 'Other'] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  city: (typeof CITY_OPTIONS)[number];
  eventType: string;
  eventDate: string;
  competitionLevel: string;
  message: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  role: '',
  city: 'DFW',
  eventType: '',
  eventDate: '',
  competitionLevel: '',
  message: '',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function InquiryForm({ accessKey, defaultType = 'livestream' }: Props) {
  const idPrefix = useId();
  const [type, setType] = useState<InquiryType>(defaultType);
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  // Static build has no per-request query parsing, so pre-selecting the
  // inquiry type from ?type=analytics is read client-side on mount.
  useEffect(() => {
    const queryType = new URLSearchParams(window.location.search).get('type');
    if (queryType && INQUIRY_TYPES.some((t) => t.value === queryType)) {
      setType(queryType as InquiryType);
    }
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.name.trim()) next.name = 'Name is required.';
    if (!values.email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!values.message.trim()) next.message = 'Tell us a bit about your event or team.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    const inquiryLabel = INQUIRY_TYPES.find((t) => t.value === type)?.label ?? type;

    const payload = {
      access_key: accessKey,
      subject: `New Matchday Live inquiry: ${inquiryLabel}`,
      from_name: values.name,
      inquiry_type: inquiryLabel,
      name: values.name,
      email: values.email,
      phone: values.phone,
      organization: values.organization,
      role: values.role,
      city: values.city,
      event_type: values.eventType,
      event_date: values.eventDate,
      competition_level: values.competitionLevel,
      message: values.message,
      botcheck: false,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setValues(initialState);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border-brand/30 bg-night-alt rounded-2xl border p-8 text-center">
        <p className="font-display text-brand text-2xl font-bold uppercase">Thanks — message sent.</p>
        <p className="text-muted mt-2">We&apos;ll follow up shortly to confirm the details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset>
        <legend className="font-display text-ink text-sm font-bold tracking-wide uppercase">
          Inquiry type
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INQUIRY_TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={type === option.value}
              onClick={() => setType(option.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                type === option.value
                  ? 'border-brand bg-brand text-night'
                  : 'border-ink/20 text-muted hover:border-brand hover:text-brand'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" id={`${idPrefix}-name`} error={errors.name}>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass(!!errors.name)}
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field label="Email" id={`${idPrefix}-email`} error={errors.email}>
          <input
            id={`${idPrefix}-email`}
            type="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label="Phone (optional)" id={`${idPrefix}-phone`}>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="Organization / club" id={`${idPrefix}-org`}>
          <input
            id={`${idPrefix}-org`}
            type="text"
            value={values.organization}
            onChange={(e) => update('organization', e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="Role" id={`${idPrefix}-role`}>
          <input
            id={`${idPrefix}-role`}
            type="text"
            value={values.role}
            onChange={(e) => update('role', e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="City" id={`${idPrefix}-city`}>
          <select
            id={`${idPrefix}-city`}
            value={values.city}
            onChange={(e) => update('city', e.target.value as FormState['city'])}
            className={inputClass(false)}
          >
            {CITY_OPTIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Field>

        {type === 'livestream' && (
          <>
            <Field label="Event type" id={`${idPrefix}-event-type`}>
              <input
                id={`${idPrefix}-event-type`}
                type="text"
                placeholder="Tournament, league match, showcase…"
                value={values.eventType}
                onChange={(e) => update('eventType', e.target.value)}
                className={inputClass(false)}
              />
            </Field>
            <Field label="Event date(s)" id={`${idPrefix}-event-date`}>
              <input
                id={`${idPrefix}-event-date`}
                type="text"
                placeholder="e.g. March 14–16"
                value={values.eventDate}
                onChange={(e) => update('eventDate', e.target.value)}
                className={inputClass(false)}
              />
            </Field>
          </>
        )}

        {type === 'analytics' && (
          <Field label="Competition level" id={`${idPrefix}-level`}>
            <input
              id={`${idPrefix}-level`}
              type="text"
              placeholder="e.g. U16 competitive, adult amateur…"
              value={values.competitionLevel}
              onChange={(e) => update('competitionLevel', e.target.value)}
              className={inputClass(false)}
            />
          </Field>
        )}
      </div>

      <Field label="Message" id={`${idPrefix}-message`} error={errors.message}>
        <textarea
          id={`${idPrefix}-message`}
          rows={5}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          className={inputClass(!!errors.message)}
          aria-invalid={!!errors.message}
        />
      </Field>

      {status === 'error' && (
        <p role="alert" className="text-live text-sm font-semibold">
          Something went wrong sending your message. Please try again, or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-brand font-display text-night hover:bg-brand-dark w-full rounded-lg px-6 py-3 text-sm font-bold tracking-wide uppercase transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return `w-full rounded-lg border bg-night px-4 py-3 text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
    invalid ? 'border-live' : 'border-ink/20 focus:border-brand'
  }`;
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-muted mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-live mt-1 text-sm font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
