import { Form } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

type AntdFormItemProps = React.ComponentProps<typeof Form.Item>;

export type FormItemProps<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
} & Omit<AntdFormItemProps, 'name' | 'normalize' | 'rules' | 'validateStatus'>;

const RegisterHook = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  children,
  help,
  ...props
}: FormItemProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleNormalize: AntdFormItemProps['normalize'] = (value) => {
          field.onChange(value);
          return value;
        };

        return (
          <Form.Item
            className="text-sm text-black"
            {...props}
            initialValue={field.value}
            normalize={handleNormalize}
            validateStatus={fieldState.invalid ? 'error' : undefined}
            help={fieldState.error?.message ?? help}
          >
            {children}
          </Form.Item>
        );
      }}
    />
  );
};
export default RegisterHook;
