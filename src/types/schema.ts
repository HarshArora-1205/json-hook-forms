export type FieldType = 'checkbox' | 'checkbox-group' | 'email' | 'number' | 'range' | 'tel' | 'select' | 'radio' | 'text' | 'textarea' | 'switch' | 'password';

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
}

export interface TextField extends BaseField {
  type: 'text';
  placeholder?: string;
}

export interface EmailField extends BaseField {
  type: 'email';
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface PasswordField extends BaseField {
  type: 'password';
  placeholder?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    step?: number;
    message?: string;
  };
}

export interface RangeField extends BaseField {
  type: 'range';
  validation: {
    min: number;
    max: number;
    step?: number;
    message?: string;
  };
}

export interface TelField extends BaseField {
  type: 'tel';
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface SelectField extends BaseField {
  type: 'select';
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface RadioField extends BaseField {
  type: 'radio';
  options: Array<{ value: string; label: string }>;
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
}

export interface CheckboxGroupField extends BaseField {
  type: 'checkbox-group';
  options: Array<{ value: string; label: string }>;
}

export interface TextareaField extends BaseField {
  type: 'textarea';
  placeholder?: string;
}

export interface SwitchField extends BaseField {
  type: 'switch';
}

export type Field = TextField | CheckboxGroupField | EmailField | PasswordField | NumberField | RangeField | TelField | SelectField | RadioField | CheckboxField | TextareaField | SwitchField;

export interface Schema {
  formTitle: string;
  formDescription: string;
  fields: Field[];
}