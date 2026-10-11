import type { InputHTMLAttributes } from 'react';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function Field({ id, label, ...props }: FieldProps) {
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} {...props} /></label>;
}
