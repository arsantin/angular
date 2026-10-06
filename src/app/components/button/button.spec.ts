import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Save');
    fixture.detectChanges();
  });

  it('renders a native button without ARIA attributes', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('Save');
    expect(button.type).toBe('button');
    expect([...button.attributes].some((attribute) => attribute.name.startsWith('aria-'))).toBe(false);
  });

  it('emits when clicked', () => {
    const click = vi.fn();
    component.clicked.subscribe(click);

    fixture.nativeElement.querySelector('button').click();

    expect(click).toHaveBeenCalledOnce();
  });

  it('uses the supplied native button type and disabled state', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
  });
});
