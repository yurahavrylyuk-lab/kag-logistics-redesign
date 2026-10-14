import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

describe('owned KAG primitives', () => {
  it('associates KAG field labels and invalid messages with their controls', () => {
    render(<Field><Label htmlFor="city">City</Label><Input aria-describedby="city-error" id="city" aria-invalid="true" /><FieldError id="city-error">Enter a city.</FieldError></Field>);
    expect(screen.getByLabelText('City')).toHaveAttribute('aria-describedby', 'city-error');
    expect(screen.getByLabelText('City')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a city.');
  });

  it('uses the KAG primary button variant without losing native button semantics', () => {
    render(<Button variant="primary">Continue</Button>);
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass('button-primary');
  });

  it('preserves explicit submit behavior and disables interaction', async () => {
    const user = userEvent.setup();
    render(<form aria-label="Request"><Button type="submit" disabled>Submit request</Button></form>);
    const button = screen.getByRole('button', { name: 'Submit request' });
    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('lets KAG button styling compose onto a native link', () => {
    render(<Button variant="secondary" asChild><a href="/solutions">Explore solutions</a></Button>);
    expect(screen.getByRole('link', { name: 'Explore solutions' })).toHaveAttribute('href', '/solutions');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps card content and long-form input semantics available', () => {
    render(<Card><CardTitle>Shipment</CardTitle><CardContent><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" required defaultValue="Handle with care" /></CardContent></Card>);
    expect(screen.getByRole('heading', { name: 'Shipment' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('Handle with care');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeRequired();
  });

  it('exposes a named select with its current value', () => {
    render(<><Label htmlFor="mode">Mode</Label><Select defaultValue="bulk"><SelectTrigger id="mode"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bulk">Bulk</SelectItem><SelectItem value="food" disabled>Food</SelectItem></SelectContent></Select></>);
    expect(screen.getByRole('combobox', { name: 'Mode' })).toHaveTextContent('Bulk');
  });

  it('opens a named modal Sheet and restores trigger focus when dismissed', async () => {
    const user = userEvent.setup();
    render(<Sheet><SheetTrigger asChild><Button>Open navigation</Button></SheetTrigger><SheetContent><SheetTitle>Navigation</SheetTitle><SheetDescription>Choose a destination.</SheetDescription><a href="/solutions">Solutions</a></SheetContent></Sheet>);
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Navigation' })).toHaveAccessibleDescription('Choose a destination.');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('reports progress to assistive technology', () => {
    render(<Progress aria-label="Quote completion" value={40} />);
    expect(screen.getByRole('progressbar', { name: 'Quote completion' })).toHaveAttribute('aria-valuenow', '40');
  });

  it('resolves conflicting utility classes while retaining KAG classes', () => {
    expect(cn('button px-2', false, 'px-4', { 'button-primary': true })).toBe('button px-4 button-primary');
  });
});
